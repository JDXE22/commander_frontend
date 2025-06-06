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
  const existingCommand = await getCommand(command.command);

  if (existingCommand && existingCommand.error === false) {
    return { error: true, message: "Command already exists" };
  }
  try {
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

export const updateCommand = async ({ updatedData, id }) => {
  try {
    const { data: updated } = await axios.patch(`${URL}/${id}`, updatedData);
    return {
      data: updated,
      error: false,
      message: "Command updated successfully",
    };
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || "Unknown error";
    console.error(`Update command error: ${message}`);
    return { data: null, error: true, message };
  }
};
