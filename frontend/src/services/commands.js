import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getCommand = async (cmd) => {
  try {
    const response = await axios.get(`${URL}/${encodeURIComponent(cmd)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching command:", error);
    return { error: true, message: error?.response?.data?.message || error.message || "Unknown error" };
  }
};

export const getCommands = async ({ page }) => {
  try {
    const response = await axios.get(`${URL}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching commands:", error);
    return [];
  }
};
