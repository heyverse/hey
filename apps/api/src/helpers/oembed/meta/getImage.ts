import getMetaContent from "./getMetaContent";

const getImage = (document: Document): null | string => {
  const image =
    getMetaContent(document, "og:image") ||
    getMetaContent(document, "twitter:image") ||
    getMetaContent(document, "twitter:image:src") ||
    null;

  return image;
};

export default getImage;
