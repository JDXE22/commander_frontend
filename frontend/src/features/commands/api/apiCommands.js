import axios from '../../../shared/api/apiClient';
import {
  normalizeCommandTrigger,
  getLegacyCommandVariant,
} from '../../../shared/utils/commandUtils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VERSION = import.meta.env.VITE_API_VERSION;
const URL = VERSION
  ? `${BASE_URL}/${VERSION}/commands`
  : `${BASE_URL}/commands`;

const searchResponseCache = new Map();

const getCacheKey = ({ query, limit }) =>
  `${query.trim().toLowerCase()}::${limit}`;

const fetchSearchVariant = async ({ query, limit, forceFresh = false }) => {
  const response = await axios.get(`${URL}/search`, {
    params: forceFresh ? { query, limit, _t: Date.now() } : { query, limit },
    validateStatus: (statusCode) =>
      (statusCode >= 200 && statusCode < 300) || statusCode === 304,
  });

  if (response.status === 304) {
    return { status: 304, payload: null };
  }

  return {
    status: response.status,
    payload: normalizeSearchResponse({ data: response.data, query, limit }),
  };
};

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
  const normalizedTrigger = normalizeCommandTrigger(cmd);
  const legacyTrigger = getLegacyCommandVariant(normalizedTrigger);
  const triggerVariants = [normalizedTrigger, legacyTrigger].filter(
    (value, index, source) => value && source.indexOf(value) === index,
  );

  let lastError;
  for (const trigger of triggerVariants) {
    try {
      const response = await axios.get(
        `${URL}?trigger=${encodeURIComponent(trigger)}`,
      );
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  return {
    error: true,
    message:
      lastError?.response?.data?.message ||
      lastError?.message ||
      'Unknown error',
  };
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
    const primaryQuery = query.trim();
    const primaryCacheKey = getCacheKey({ query: primaryQuery, limit });

    const primaryResult = await fetchSearchVariant({
      query: primaryQuery,
      limit,
    });

    let resolvedResult = primaryResult.payload;
    if (primaryResult.status === 304) {
      resolvedResult = searchResponseCache.get(primaryCacheKey);
      if (!resolvedResult) {
        const freshResult = await fetchSearchVariant({
          query: primaryQuery,
          limit,
          forceFresh: true,
        });
        resolvedResult = freshResult.payload;
        if (resolvedResult) {
          searchResponseCache.set(primaryCacheKey, resolvedResult);
        }
      }
    } else if (resolvedResult) {
      searchResponseCache.set(primaryCacheKey, resolvedResult);
    }

    if (!resolvedResult) {
      return { error: true, message: 'Search returned no usable response' };
    }

    const noMatches = (resolvedResult.commands || []).length === 0;
    const shouldTryLegacyVariant = primaryQuery.startsWith('/') && noMatches;
    if (!shouldTryLegacyVariant) {
      return resolvedResult;
    }

    const legacyQuery = getLegacyCommandVariant(primaryQuery);
    if (!legacyQuery) {
      return resolvedResult;
    }

    const legacyResult = await fetchSearchVariant({
      query: legacyQuery,
      limit,
      forceFresh: true,
    });
    const legacyPayload = legacyResult.payload;
    if ((legacyPayload?.commands || []).length === 0) {
      return resolvedResult;
    }

    const legacyCacheKey = getCacheKey({ query: legacyQuery, limit });
    searchResponseCache.set(legacyCacheKey, legacyPayload);
    return legacyPayload;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || 'Search failed',
    };
  }
};

export const saveCommand = async ({ command }) => {
  const normalizedPayload = {
    ...command,
    command: normalizeCommandTrigger(command.command),
  };

  const existingCommand = await getCommand(normalizedPayload.command);

  if (existingCommand && existingCommand.error === false) {
    return { error: true, message: 'Command already exists' };
  }
  try {
    const response = await axios.post(`${URL}`, normalizedPayload);
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
