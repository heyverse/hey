import { describe, expect, it } from "vitest";
import getURLs from "./getURLs";

describe("getURLs", () => {
  it("extracts all URLs from a social media post", () => {
    const post =
      "Check out https://example.com/blog and http://social.com/profile/hey #fun";
    const result = getURLs(post);
    expect(result).toEqual([
      "https://example.com/blog",
      "http://social.com/profile/hey"
    ]);
  });

  it("returns an empty array when no URLs are present", () => {
    const post = "Enjoying the sunshine #weekend @friend";
    const result = getURLs(post);
    expect(result).toEqual([]);
  });

  it("ignores invalid URL formats", () => {
    const post = "Visit htps://broken.com and http://good.com";
    const result = getURLs(post);
    expect(result).toEqual(["http://good.com"]);
  });

  it("handles punctuation after URLs", () => {
    const post = "Latest news: https://news.com/update! Stay tuned.";
    const result = getURLs(post);
    expect(result).toEqual(["https://news.com/update"]);
  });
});
