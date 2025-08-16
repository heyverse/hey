const MIN_LENGTH = 25;
const MAX_LENGTH = 160;

const normalizeDescription = (
  text: string | null | undefined,
  fallback: string
): string => {
  const trimmed = (text ?? "").trim();
  const base = trimmed.length >= MIN_LENGTH ? trimmed : fallback.trim();
  return base.slice(0, MAX_LENGTH);
};

export default normalizeDescription;
