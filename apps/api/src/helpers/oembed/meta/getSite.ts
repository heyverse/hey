/**
 * Get the site name from the document.
 *
 * @param {Document} document - The document to get the site name from.
 * @returns {null | string} The site name, or null if not found.
 */
const getSite = (document: Document): null | string => {
  const og =
    document.querySelector('meta[name="og:site_name"]') ||
    document.querySelector('meta[property="og:site_name"]');
  const twitter =
    document.querySelector('meta[name="twitter:site"]') ||
    document.querySelector('meta[property="twitter:site"]');

  if (og) {
    return og.getAttribute("content");
  }

  if (twitter) {
    return twitter.getAttribute("content");
  }

  return null;
};

export default getSite;
