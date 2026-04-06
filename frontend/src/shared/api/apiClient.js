import axios from 'axios';

const STORAGE_KEYS = {
  TOKEN: 'commander_token',
};

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
