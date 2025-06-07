import { NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import isAccountDeleted from "./isAccountDeleted";

describe("isAccountDeleted", () => {
  it("returns true when owner is null address", () => {
    expect(
      isAccountDeleted({ owner: NULL_ADDRESS } as unknown as AccountFragment)
    ).toBe(true);
  });
  it("returns false otherwise", () => {
    expect(
      isAccountDeleted({ owner: "0x1" } as unknown as AccountFragment)
    ).toBe(false);
  });
});
