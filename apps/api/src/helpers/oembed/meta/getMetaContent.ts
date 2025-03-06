const getMetaContent = (document: Document, name: string): string | null => {
  const metaTag =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);

  return metaTag ? metaTag.getAttribute("content") : null;
};

export default getMetaContent;
