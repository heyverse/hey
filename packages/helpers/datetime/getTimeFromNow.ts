import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Retrieves the formatted date string as a string representing the time from now.
 *
 * @param {Date} date - The date to format.
 * @returns {string} A string representing the time from now.
 */
const getTimeFromNow = (date: Date) => {
  return dayjs(date).fromNow();
};

export default getTimeFromNow;
