const truncateByWords = (string: string, count: number): string => {
  const strArr = string.split(" ");
  if (strArr.length > count) {
    return `${strArr.slice(0, count).join(" ")}…`;
  }
  return string;
};

export default truncateByWords;
