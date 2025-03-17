import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const formatDate = (date: Date | string, format = "MMMM D, YYYY") => {
  return dayjs(new Date(date)).format(format);
};

export default formatDate;
