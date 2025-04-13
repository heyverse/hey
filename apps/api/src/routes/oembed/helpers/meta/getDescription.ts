import getMetaContent from "./getMetaContent";

const getDescription = (document: Document): null | string => {
  const description =
    getMetaContent(document, "og:description") ||
    getMetaContent(document, "twitter:description") ||
    null;

  return description;
};

export default getDescription;
