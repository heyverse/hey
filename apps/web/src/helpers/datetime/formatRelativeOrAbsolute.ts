import dayjs from "dayjs";

const formatRelativeOrAbsolute = (date: Date | string) => {
  const now = dayjs();
  const targetDate = dayjs(date);
  const diffInDays = now.diff(targetDate, "day");
  const diffInHours = now.diff(targetDate, "hour");
  const diffInMinutes = now.diff(targetDate, "minute");
  const diffInSeconds = now.diff(targetDate, "second");

  if (diffInDays >= 1) {
    // More than a day
    return diffInDays < 7
      ? `${diffInDays}d`
      : targetDate.format(
          now.isSame(targetDate, "year") ? "MMM D" : "MMM D, YYYY"
        );
  }

  if (diffInHours >= 1) {
    // More than an hour
    return `${diffInHours}h`;
  }

  if (diffInMinutes >= 1) {
    // More than a minute
    return `${diffInMinutes}m`;
  }

  // Seconds
  return `${diffInSeconds}s`;
};

export default formatRelativeOrAbsolute;
