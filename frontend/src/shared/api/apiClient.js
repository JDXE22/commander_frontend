import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;
const API_URL = VERSION ? `${BASE_URL}/${VERSION}` : BASE_URL;
const AUTH_URL = `${API_URL}/auth`;

let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};

let onSessionExpired = () => {};
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Axios Instance ───
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const csrfToken = getCookie('__csrf');
      const { data } = await axios.post(`${AUTH_URL}/refresh`, null, {
        withCredentials: true,
        headers: { 'x-csrf-token': csrfToken || '' },
      });

      accessToken = data.accessToken;
      processQueue(null, accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      accessToken = null;
      onSessionExpired();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export async function refreshSession() {
  const csrfToken = getCookie('__csrf');
  const { data } = await axios.post(`${AUTH_URL}/refresh`, null, {
    withCredentials: true,
    headers: { 'x-csrf-token': csrfToken || '' },
  });
  accessToken = data.accessToken;
  return data;
}

export default apiClient;
