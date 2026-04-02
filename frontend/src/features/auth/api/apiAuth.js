import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;
const URL = VERSION ? `${BASE_URL}/${VERSION}/auth` : `${BASE_URL}/auth`;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.message || error.message || 'Login failed',
    };
  }
};

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${URL}/register`, { email, password });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error?.response?.data?.message || error.message || 'Registration failed',
    };
  }
};
