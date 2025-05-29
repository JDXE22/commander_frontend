import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getCommand = async (cmd) => {
  try {
    const response = await axios.get(`${URL}/${encodeURIComponent(cmd)}`);
    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || "Unknown error",
    };
  }
};

export const getCommands = async ({ page }) => {
  try {
    const { commands = [], totalPages = 0 } = (
      await axios.get(`${URL}?page=${page}`)
    ).data;
    return { commands, totalPages };
  } catch (error) {
    return {
      commands: [],
      totalPages: 0,
      error: true,
      message:
        error?.response?.data?.message || error.message || "Unknown error",
    };
  }
};

export const saveCommand = async ({ command }) => {
  try {
    const existingCommand = await getCommand(command.command);
    if (existingCommand) {
      return {
        error: true,
        message: "Command already exists",
      };
    }

    const response = await axios.post(`${URL}`, command);

    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || "Unknown error",
    };
  }
};

export const updateCommand = async ({ updatedInput, id }) => {
  try {
    const updatedCommand = await axios.patch(`${URL}/${id}`, updatedInput);
    return updatedCommand.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || "Unknown error";
    console.error(`Update command error: ${message}`);
    return { data: null, error: true, message };
  }
};
