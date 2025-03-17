import { Regex } from "@hey/data/regex";

const sanitizeDisplayName = (name?: null | string): null | string => {
  if (!name) {
    return null;
  }

  return name.replace(Regex.accountNameFilter, " ").trim().replace(/\s+/g, " ");
};

export default sanitizeDisplayName;
