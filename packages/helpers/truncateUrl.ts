/**
 * Retrieves the truncated URL by removing the protocol and adding an ellipsis if truncated.
 *
 * @param url The URL to truncate.
 * @param maxLength The maximum number of characters to truncate to.
 * @returns The truncated URL.
 */
const truncateUrl = (url: string, maxLength: number): string => {
  const strippedUrl = url
    .replace(/^(http|https):\/\//, "")
    .replace(/^www\./, "");

  if (new URL(url).hostname.endsWith("hey.xyz")) {
    return strippedUrl;
  }

  if (strippedUrl.length > maxLength) {
    return `${strippedUrl.substring(0, maxLength - 1)}…`;
  }

  return strippedUrl;
};

export default truncateUrl;
