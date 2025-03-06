const humanize = (number: number): string => {
  if (typeof number !== "number" || Number.isNaN(number)) {
    return "";
  }

  return number.toLocaleString();
};

export default humanize;
