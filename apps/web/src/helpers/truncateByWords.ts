const truncateByWords = (str: string, count: number): string => {
  const words = str.trim().split(/\s+/);
  return words.length > count ? `${words.slice(0, count).join(" ")}…` : str;
};

export default truncateByWords;
