/**
 * Retrieves the number of seconds equivalent to a given number of hours.
 *
 * @param {number} hours - The number of hours.
 * @returns {number} The number of seconds equivalent to the given number of hours.
 */
const hoursToSeconds = (hours: number): number => {
  return hours * 60 * 60;
};

export default hoursToSeconds;
