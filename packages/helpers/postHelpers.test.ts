import type { AnyPostFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import { isRepost } from "./postHelpers";

describe("isRepost", () => {
  it("returns true when user shares a viral Web3 meme", () => {
    const post = { __typename: "Repost" } as unknown as AnyPostFragment;
    expect(isRepost(post)).toBe(true);
  });

  it("returns false when user creates original crypto content", () => {
    const post = { __typename: "Post" } as unknown as AnyPostFragment;
    expect(isRepost(post)).toBe(false);
  });

  it("returns false when post data is unavailable", () => {
    expect(isRepost(null)).toBe(false);
  });
});
