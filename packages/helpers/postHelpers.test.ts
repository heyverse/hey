import { describe, expect, it } from "vitest";
import { isRepost } from "./postHelpers";

describe("isRepost", () => {
  it("detects repost", () => {
    expect(isRepost({ __typename: "Repost" } as any)).toBe(true);
  });
  it("returns false otherwise", () => {
    expect(isRepost({ __typename: "Post" } as any)).toBe(false);
  });
  it("returns false when argument is null", () => {
    expect(isRepost(null)).toBe(false);
  });
  it("returns false for other typenames", () => {
    expect(isRepost({ __typename: "Mirror" } as any)).toBe(false);
  });
});
