const getDbPostId = (decimal: string) => {
  const hex = BigInt(decimal).toString(16);
  return `\\x${hex}`;
};

export default getDbPostId;
