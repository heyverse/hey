/**
 * Retrieves the number of seconds equivalent to a given number of days.
 *
 * @param days The number of days.
 * @returns The number of seconds equivalent to the given number of days.
 */
const daysToSeconds = (days: number): number => {
  return days * 24 * 60 * 60;
};

export default daysToSeconds;
