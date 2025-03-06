/**
 * Get the description from the document.
 *
 * @param {Document} document - The document to get the description from.
 * @returns {null | string} The description, or null if not found.
 */
const getDescription = (document: Document): null | string => {
  const og =
    document.querySelector('meta[name="og:description"]') ||
    document.querySelector('meta[property="og:description"]');
  const twitter =
    document.querySelector('meta[name="twitter:description"]') ||
    document.querySelector('meta[property="twitter:description"]');

  if (og) {
    return og.getAttribute("content");
  }

  if (twitter) {
    return twitter.getAttribute("content");
  }

  return null;
};

export default getDescription;
