import dayjs from "dayjs";

/**
 * Retrieves the date after adding a specified number of months.
 *
 * @param {Date | string} date - The date to add months to.
 * @param {number} months - The number of months to add.
 * @returns {Date} The date after adding the specified number of months.
 */
const addMonthsToDate = (date: Date | string, months: number) => {
  return dayjs(new Date(date)).add(months, "month");
};

export default addMonthsToDate;
