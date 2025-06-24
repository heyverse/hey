import { addDays } from "date-fns";

const getTimeAddedNDay = (day: number) => {
  return addDays(new Date(), day).toISOString();
};

export default getTimeAddedNDay;
