import getMetaContent from "./getMetaContent";

const getSite = (document: Document): null | string => {
  const site =
    getMetaContent(document, "og:site_name") ||
    getMetaContent(document, "twitter:site") ||
    null;

  return site;
};

export default getSite;
