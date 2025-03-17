import urlcat from "urlcat";

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
