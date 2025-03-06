import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Retrieves the formatted date string in the format used by the application.
 *
 * @param {Date | string} date - The date to format.
 * @param {string} [format="MMMM D, YYYY"] - The format to use for the date.
 * @returns {string} The formatted date string.
 */
const formatDate = (date: Date | string, format = "MMMM D, YYYY") => {
  return dayjs(new Date(date)).format(format);
};

export default formatDate;
