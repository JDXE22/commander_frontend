import apiClient, { setAccessToken } from '../../../shared/api/apiClient';

const AUTH_URL = '/auth';

export const loginUser = async (email, password) => {
  try {
    const { data } = await apiClient.post(`${AUTH_URL}/login`, {
      email,
      password,
    });
    setAccessToken(data.accessToken);
    return data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || 'Login failed',
    };
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const { data } = await apiClient.post(`${AUTH_URL}/register`, {
      username,
      email,
      password,
    });
    setAccessToken(data.accessToken);
    return data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message ||
        error.message ||
        'Registration failed',
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    const { data } = await apiClient.post(`${AUTH_URL}/forgot-password`, {
      email,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message ||
        error.message ||
        'Reset request failed',
    };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const { data } = await apiClient.post(`${AUTH_URL}/password-resets`, {
      token,
      newPassword,
    });
    return data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message ||
        error.message ||
        'Password reset failed',
    };
  }
};
