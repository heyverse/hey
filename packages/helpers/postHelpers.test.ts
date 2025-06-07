import type { AnyPostFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import { isRepost } from "./postHelpers";

describe("isRepost", () => {
  it("detects repost", () => {
    expect(
      isRepost({ __typename: "Repost" } as unknown as AnyPostFragment)
    ).toBe(true);
  });
  it("returns false otherwise", () => {
    expect(isRepost({ __typename: "Post" } as unknown as AnyPostFragment)).toBe(
      false
    );
  });
});
