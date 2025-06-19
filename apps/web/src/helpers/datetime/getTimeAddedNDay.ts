import utc from "dayjs/plugin/utc";
import dayjs from "./dayjs";

dayjs.extend(utc);

const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, "day").utc().format();
};

export default getTimeAddedNDay;
