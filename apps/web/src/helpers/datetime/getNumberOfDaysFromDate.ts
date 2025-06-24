import { differenceInCalendarDays, startOfDay } from "date-fns";

const getNumberOfDaysFromDate = (date: Date) => {
  const currentDate = startOfDay(new Date());
  const targetDate = startOfDay(date);

  return differenceInCalendarDays(targetDate, currentDate);
};

export default getNumberOfDaysFromDate;
