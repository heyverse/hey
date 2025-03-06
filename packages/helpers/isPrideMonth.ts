/**
 * Retrieves whether the current month is June.
 *
 * @returns A boolean indicating whether the current month is June.
 */
const isPrideMonth = () => {
  const today = new Date();
  const month = today.getMonth();

  return month === 5;
};

export default isPrideMonth;
