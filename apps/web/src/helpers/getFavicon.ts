const FAVICON_BASE_URL = "https://external-content.duckduckgo.com/ip3";
const UNKNOWN_DOMAIN = "unknowndomain";

const getFavicon = (url: string): string => {
  if (!url) {
    return `${FAVICON_BASE_URL}/${UNKNOWN_DOMAIN}.ico`;
  }

  try {
    const { hostname } = new URL(url);
    return `${FAVICON_BASE_URL}/${hostname || UNKNOWN_DOMAIN}.ico`;
  } catch {
    return `${FAVICON_BASE_URL}/${UNKNOWN_DOMAIN}.ico`;
  }
};

export default getFavicon;
