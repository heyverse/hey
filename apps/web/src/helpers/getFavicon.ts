const FAVICON_BASE_URL = "https://external-content.duckduckgo.com/ip3";
const UNKNOWN_DOMAIN = "unknowndomain";

const getFavicon = (url: string): string => {
  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return UNKNOWN_DOMAIN;
    }
  })();

  return `${FAVICON_BASE_URL}/${domain || UNKNOWN_DOMAIN}.ico`;
};

export default getFavicon;
