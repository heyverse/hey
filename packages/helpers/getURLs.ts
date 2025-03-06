import { Regex } from "@hey/data/regex";

/**
 * Retrieves an array of URLs found in the specified text.
 *
 * @param {string} text - The text to retrieve URLs from.
 * @returns {string[]} An array of URLs.
 */
const getURLs = (text: string): string[] => {
  if (!text) {
    return [];
  }
  return text.match(Regex.url) || [];
};

export default getURLs;
