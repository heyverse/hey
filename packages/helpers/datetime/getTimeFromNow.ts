import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getTimeFromNow = (date: Date) => {
  return dayjs(date).fromNow();
};

export default getTimeFromNow;
