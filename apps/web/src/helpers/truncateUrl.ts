const truncateUrl = (url: string, maxLength: number): string => {
  try {
    const parsed = new URL(url);
    const stripped =
      `${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`.replace(
        /^www\./,
        ""
      );

    if (parsed.hostname.endsWith("hey.xyz")) return stripped;

    return stripped.length > maxLength
      ? `${stripped.slice(0, maxLength - 1)}…`
      : stripped;
  } catch {
    // fallback: remove protocol/www, truncate if needed
    const stripped = `${url.replace(/^(https?:\/\/)?(www\.)?/, "")}`;
    return stripped.length > maxLength
      ? `${stripped.slice(0, maxLength - 1)}…`
      : stripped;
  }
};

export default truncateUrl;
