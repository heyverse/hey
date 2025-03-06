import urlcat from "urlcat";

/**
 * Retrieves the favicon URL for a given URL.
 *
 * @param {string} url - The URL to retrieve the favicon for.
 * @returns {string} The favicon URL or a default favicon URL if the URL is invalid.
 */
const getFavicon = (url: string) => {
  try {
    const { hostname } = new URL(url);

    return urlcat("https://external-content.duckduckgo.com/ip3/:domain.ico", {
      domain: hostname || "unknowndomain"
    });
  } catch {
    return "https://external-content.duckduckgo.com/ip3/unknowndomain.ico";
  }
};

export default getFavicon;
