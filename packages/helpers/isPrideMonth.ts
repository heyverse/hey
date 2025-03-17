const isPrideMonth = () => {
  const today = new Date();
  const month = today.getMonth();

  return month === 5;
};

export default isPrideMonth;
