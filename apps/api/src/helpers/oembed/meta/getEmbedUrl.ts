import getMetaContent from "./getMetaContent";

const getEmbedUrl = (document: Document): null | string => {
  const url =
    getMetaContent(document, "og:video:url") ||
    getMetaContent(document, "og:video:secure_url") ||
    getMetaContent(document, "twitter:player") ||
    null;

  return url;
};

export default getEmbedUrl;
