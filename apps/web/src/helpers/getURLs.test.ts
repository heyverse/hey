import { describe, expect, it } from "vitest";
import getURLs from "./getURLs";

describe("getURLs", () => {
  it("returns empty array when text is empty", () => {
    expect(getURLs("")).toEqual([]);
  });

  it("extracts urls from text", () => {
    const urls = getURLs("visit https://a.com and http://b.com");
    expect(urls).toEqual(["https://a.com", "http://b.com"]);
  });

  it("strips trailing punctuation", () => {
    const urls = getURLs("go to https://foo.com.");
    expect(urls).toEqual(["https://foo.com"]);
  });
});
