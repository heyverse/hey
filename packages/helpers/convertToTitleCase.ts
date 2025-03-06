/**
 * Retrieves the string converted from snake_case to Title Case.
 *
 * @param {string} input The string to convert.
 * @returns {string} The converted string.
 */
const convertToTitleCase = (input: string): string => {
  const words = input.toLowerCase().split("_");
  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  return titleCasedWords.join(" ");
};

export default convertToTitleCase;
