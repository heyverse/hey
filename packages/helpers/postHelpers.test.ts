import { describe, expect, it } from "vitest";
import { isRepost } from "./postHelpers";

describe("isRepost", () => {
  it("detects repost", () => {
    expect(isRepost({ __typename: "Repost" } as any)).toBe(true);
  });
  it("returns false otherwise", () => {
    expect(isRepost({ __typename: "Post" } as any)).toBe(false);
  });
});
