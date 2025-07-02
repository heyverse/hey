import type { AnyPostFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import { isRepost } from "./postHelpers";

describe("isRepost", () => {
  it("returns true when post has Repost typename", () => {
    const post = { __typename: "Repost" } as unknown as AnyPostFragment;
    expect(isRepost(post)).toBe(true);
  });

  it("returns false when post has different typename", () => {
    const post = { __typename: "Post" } as unknown as AnyPostFragment;
    expect(isRepost(post)).toBe(false);
  });

  it("returns false when post is null", () => {
    expect(isRepost(null)).toBe(false);
  });
});
