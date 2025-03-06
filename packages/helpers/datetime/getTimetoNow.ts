import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Retrieves the formatted date string as a string representing the elapsed time between the date and the current time.
 *
 * @param {Date} date - The date to format.
 * @returns {string} A string representing the elapsed time between the date and the current time.
 */
const getTimetoNow = (date: Date) => {
  return dayjs(date).toNow(true);
};

export default getTimetoNow;
