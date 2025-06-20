const getDbPostId = (decimal: string): string => {
  if (!/^\d+$/.test(decimal)) {
    if (decimal === "") {
      return "";
    }

    throw new Error("Invalid decimal value");
  }

  return `\\x${BigInt(decimal).toString(16)}`;
};

export default getDbPostId;
