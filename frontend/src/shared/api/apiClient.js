import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;
const API_URL = VERSION ? `${BASE_URL}/${VERSION}` : BASE_URL;
const AUTH_URL = `${API_URL}/auth`;

const REFRESH_SAFETY_MARGIN_MS = 60_000; // refresh 1 min before AT expiry
let refreshTimerId = null;

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function scheduleProactiveRefresh(token) {
  clearScheduledRefresh();

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return;

  const expiresAtMs = payload.exp * 1000;
  const nowMs = Date.now();
  const delayMs = expiresAtMs - nowMs - REFRESH_SAFETY_MARGIN_MS;

  if (delayMs <= 0) {
    silentRefresh();
    return;
  }

  refreshTimerId = setTimeout(() => silentRefresh(), delayMs);
}

function clearScheduledRefresh() {
  if (refreshTimerId !== null) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}

async function silentRefresh() {
  try {
    await refreshSession();
  } catch {
    accessToken = null;
    onSessionExpired();
  }
}
let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    scheduleProactiveRefresh(token);
  }
};
export const clearAccessToken = () => {
  accessToken = null;
  clearScheduledRefresh();
};

let onSessionExpired = () => {};
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

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
      scheduleProactiveRefresh(accessToken);
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
  scheduleProactiveRefresh(accessToken);
  return data;
}

export default apiClient;
