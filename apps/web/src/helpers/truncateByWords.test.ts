import { describe, expect, it } from "vitest";
import truncateByWords from "./truncateByWords";

describe("truncateByWords", () => {
  it("truncates lengthy captions to the specified number of words", () => {
    const caption = "This is a sample caption for social media post";
    expect(truncateByWords(caption, 5)).toBe("This is a sample caption…");
  });

  it("returns the full comment when it is within the limit", () => {
    const comment = "Love this app";
    expect(truncateByWords(comment, 5)).toBe(comment);
  });

  it("handles extra whitespace gracefully", () => {
    const bio = "  Welcome to the   new social network  ";
    expect(truncateByWords(bio, 4)).toBe("Welcome to the new…");
  });
});
