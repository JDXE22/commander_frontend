/**
 * Normalizes a command trigger to ensure it starts with a single forward slash.
 * @param {string} value - The raw input trigger.
 * @returns {string} - The normalized trigger (e.g., "/cmd").
 */
export const normalizeCommandTrigger = (value = '') => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return '';
  return trimmedValue.startsWith('/') ? trimmedValue : `/${trimmedValue}`;
};

/**
 * Returns a variant of the command trigger without the leading slash.
 * @param {string} value - The trigger to strip.
 * @returns {string} - The legacy variant (e.g., "cmd").
 */
export const getLegacyCommandVariant = (value = '') => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return '';
  return trimmedValue.startsWith('/') ? trimmedValue.slice(1) : trimmedValue;
};

/**
 * Normalizes a trigger for internal trial comparisons (no slashes, lowercase).
 * @param {string} value - The trigger to compare.
 * @returns {string} - Comparative variant.
 */
export const normalizeTrialComparison = (value = '') =>
  value.trim().replace(/^\/+/, '').toLowerCase();
