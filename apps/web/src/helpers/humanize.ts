const humanize = (n: number): string =>
  Number.isFinite(n) ? n.toLocaleString() : "";

export default humanize;
