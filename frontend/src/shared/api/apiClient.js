import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;
const API_URL = VERSION ? `${BASE_URL}/${VERSION}` : BASE_URL;
const AUTH_URL = `${API_URL}/auth`;

const REFRESH_SAFETY_MARGIN_MS = 60_000;

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
    clearAccessToken();
    onSessionExpired();
  }
}

let accessToken = null;
let csrfToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    scheduleProactiveRefresh(token);
  }
};
export const setCsrfToken = (token) => {
  csrfToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
  csrfToken = null;
  clearScheduledRefresh();
};

let onSessionExpired = () => {};
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (csrfToken) {
    config.headers['x-csrf-token'] = csrfToken;
  }
  return config;
});

let refreshPromise = null;

async function performRefresh() {
  try {
    const { data } = await axios.post(`${AUTH_URL}/refresh`, null, {
      withCredentials: true,
      headers: csrfToken ? { 'x-csrf-token': csrfToken } : {},
    });
    accessToken = data.accessToken;
    if (data.csrfToken) {
      csrfToken = data.csrfToken;
    }
    scheduleProactiveRefresh(accessToken);
    return data;
  } finally {
    refreshPromise = null;
  }
}

function executeRefresh() {
  if (!refreshPromise) {
    refreshPromise = performRefresh();
  }
  return refreshPromise;
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

    originalRequest._retry = true;

    try {
      const data = await executeRefresh();
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      if (data.csrfToken) {
        originalRequest.headers['x-csrf-token'] = data.csrfToken;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      onSessionExpired();
      return Promise.reject(refreshError);
    }
  },
);

export async function refreshSession() {
  return executeRefresh();
}

export default apiClient;
