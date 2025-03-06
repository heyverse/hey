/**
 * Retrieves the truncated string by words and adds an ellipsis.
 *
 * @param string The string to truncate.
 * @param count The number of words to truncate to.
 * @returns The truncated string.
 */
const truncateByWords = (string: string, count: number): string => {
  const strArr = string.split(" ");
  if (strArr.length > count) {
    return `${strArr.slice(0, count).join(" ")}…`;
  }
  return string;
};

export default truncateByWords;
