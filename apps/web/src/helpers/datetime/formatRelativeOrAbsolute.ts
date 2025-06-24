import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isSameYear
} from "date-fns";

const formatRelativeOrAbsolute = (date: Date | string) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInDays = differenceInDays(now, targetDate);
  const diffInHours = differenceInHours(now, targetDate);
  const diffInMinutes = differenceInMinutes(now, targetDate);
  const diffInSeconds = differenceInSeconds(now, targetDate);

  if (diffInDays >= 1) {
    // More than a day
    return diffInDays < 7
      ? `${diffInDays}d`
      : format(
          targetDate,
          isSameYear(now, targetDate) ? "MMM d" : "MMM d, yyyy"
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
