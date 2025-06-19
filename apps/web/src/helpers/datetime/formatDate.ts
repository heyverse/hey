import dayjs from "./dayjs";

const formatDate = (date: Date | string, format = "MMMM D, YYYY") => {
  return dayjs(new Date(date)).format(format);
};

export default formatDate;
