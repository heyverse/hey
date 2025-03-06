import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getTimetoNow = (date: Date) => {
  return dayjs(date).toNow(true);
};

export default getTimetoNow;
