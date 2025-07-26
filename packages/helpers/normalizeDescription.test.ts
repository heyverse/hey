import { describe, expect, it } from "vitest";
import normalizeDescription from "./normalizeDescription";

describe("normalizeDescription", () => {
  it("uses fallback when text is too short", () => {
    const result = normalizeDescription(
      "short",
      "This fallback description is definitely longer than twenty five characters."
    );
    expect(result).toBe(
      "This fallback description is definitely longer than twenty five characters.".slice(
        0,
        160
      )
    );
  });

  it("truncates long text", () => {
    const longText = "a".repeat(200);
    expect(normalizeDescription(longText, "fallback").length).toBe(160);
  });

  it("returns trimmed text when within range", () => {
    const text = "This is a valid description for OG meta tags.";
    expect(normalizeDescription(text, "fallback")).toBe(text);
  });
});
