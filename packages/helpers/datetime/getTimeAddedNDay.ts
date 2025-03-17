import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, "day").utc().format();
};

export default getTimeAddedNDay;
