import axios from '../../../shared/api/apiClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;
const URL = VERSION
  ? `${BASE_URL}/${VERSION}/commands`
  : `${BASE_URL}/commands`;

const searchResponseCache = new Map();

const normalizeSearchResponse = ({ data, query, limit }) => {
  if (Array.isArray(data?.commands)) {
    return data;
  }

  const templates = Array.isArray(data?.templates) ? data.templates : [];
  const commands = templates.map((template) => ({
    _id: template.id,
    name: template.name,
    text: template.content,
    command: template.command,
    match: template.match,
  }));

  return {
    ...data,
    query: data?.query ?? query,
    limit: data?.limit ?? limit,
    total: data?.total ?? commands.length,
    commands,
  };
};

export const getCommand = async (cmd) => {
  try {
    const response = await axios.get(
      `${URL}?trigger=${encodeURIComponent(cmd)}`,
    );
    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || 'Unknown error',
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
        error?.response?.data?.message || error.message || 'Unknown error',
    };
  }
};

export const searchCommands = async ({ query, limit = 10 }) => {
  try {
    const cacheKey = `${query.trim().toLowerCase()}::${limit}`;
    const response = await axios.get(`${URL}/search`, {
      params: { query, limit },
      validateStatus: (statusCode) =>
        (statusCode >= 200 && statusCode < 300) || statusCode === 304,
    });

    if (response.status === 304) {
      const cachedResponse = searchResponseCache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }

      const freshResponse = await axios.get(`${URL}/search`, {
        params: { query, limit, _t: Date.now() },
      });
      const normalizedFreshResponse = normalizeSearchResponse({
        data: freshResponse.data,
        query,
        limit,
      });
      searchResponseCache.set(cacheKey, normalizedFreshResponse);
      return normalizedFreshResponse;
    }

    const normalizedResponse = normalizeSearchResponse({
      data: response.data,
      query,
      limit,
    });
    searchResponseCache.set(cacheKey, normalizedResponse);
    return normalizedResponse;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || 'Search failed',
    };
  }
};

export const saveCommand = async ({ command }) => {
  const existingCommand = await getCommand(command.command);

  if (existingCommand && existingCommand.error === false) {
    return { error: true, message: 'Command already exists' };
  }
  try {
    const response = await axios.post(`${URL}`, command);
    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || 'Unknown error',
    };
  }
};

export const updateCommand = async ({ updatedData, id }) => {
  try {
    const { data: updated } = await axios.patch(`${URL}/${id}`, updatedData);
    return {
      data: updated,
      error: false,
      message: 'Command updated successfully',
    };
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || 'Unknown error';
    console.error(`Update command error: ${message}`);
    return { data: null, error: true, message };
  }
};
