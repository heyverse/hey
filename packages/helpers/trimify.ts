/**
 * Retrieves the trimmed string with excess newlines removed.
 *
 * @param value The string to trim.
 * @returns The trimmed string.
 */
const trimify = (value: string): string =>
  value?.replace(/\n\n\s*\n/g, "\n\n").trim();

export default trimify;
