import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getNumberOfDaysFromDate = (date: Date) => {
  const currentDate = dayjs().startOf("day");
  const targetDate = dayjs(date).startOf("day");

  return targetDate.diff(currentDate, "day");
};

export default getNumberOfDaysFromDate;
