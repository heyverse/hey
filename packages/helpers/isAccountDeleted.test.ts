import { NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import isAccountDeleted from "./isAccountDeleted";

describe("isAccountDeleted", () => {
  it("returns true when the account owner is the null address", () => {
    const account = { owner: NULL_ADDRESS } as unknown as AccountFragment;
    expect(isAccountDeleted(account)).toBe(true);
  });

  it("returns false when the account owner is not the null address", () => {
    const account = { owner: "0x123" } as unknown as AccountFragment;
    expect(isAccountDeleted(account)).toBe(false);
  });
});
