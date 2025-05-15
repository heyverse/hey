const splitNumber = (num = 1, parts = 1): number[] => {
  const base = Math.floor(num / parts);
  const rem = num % parts;
  return Array.from({ length: parts }, (_, i) => base + (i < rem ? 1 : 0));
};

export default splitNumber;
