const getDbPostId = (decimal: string): string =>
  `\\x${BigInt(decimal).toString(16)}`;

export default getDbPostId;
