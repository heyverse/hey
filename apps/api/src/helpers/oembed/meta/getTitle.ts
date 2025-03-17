import getMetaContent from "./getMetaContent";

const getTitle = (document: Document): null | string => {
  const title =
    getMetaContent(document, "og:title") ||
    getMetaContent(document, "twitter:title") ||
    null;

  return title;
};

export default getTitle;
