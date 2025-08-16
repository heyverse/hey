import humanize from "./humanize";

const LOOKUP = [
  { symbol: "E", value: 1e18 },
  { symbol: "P", value: 1e15 },
  { symbol: "T", value: 1e12 },
  { symbol: "G", value: 1e9 },
  { symbol: "M", value: 1e6 },
  { symbol: "k", value: 1e3 },
  { symbol: "", value: 1 }
];

const TRIM_ZEROES_REGEX = /\.0+$|(\.\d*[1-9])0+$/;

const nFormatter = (num: number, digits = 1): string => {
  if (!Number.isFinite(num)) {
    return "";
  }

  if (num < 1000) {
    return humanize(num);
  }

  const item = LOOKUP.find((i) => num >= i.value);
  if (!item) {
    return "0";
  }

  return (num / item.value)
    .toFixed(digits)
    .replace(TRIM_ZEROES_REGEX, "$1")
    .concat(item.symbol);
};

export default nFormatter;
