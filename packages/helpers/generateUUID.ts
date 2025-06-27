const generateUUID = (): string => {
  return crypto.randomUUID();
};

export default generateUUID;
