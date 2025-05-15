import humanize from "@/helpers/humanize";

const nFormatter = (num: number, digits = 1): string => {
  if (!Number.isFinite(num)) return "";

  const lookup = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
    { value: 1, symbol: "" }
  ];
  const rx = /\.0+$|(\.\d*[1-9])0+$/;

  const item = lookup.find((i) => num >= i.value);

  if (!item) return "0";
  if (num < 1000) return humanize(num);

  return (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol;
};

export default nFormatter;
