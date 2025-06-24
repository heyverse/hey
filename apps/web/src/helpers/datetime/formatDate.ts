import { format as formatDateFns } from "date-fns";

const formatDate = (date: Date | string, format = "MMMM d, yyyy") => {
  return formatDateFns(new Date(date), format);
};

export default formatDate;
