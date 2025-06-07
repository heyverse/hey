import { NULL_ADDRESS } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import isAccountDeleted from "./isAccountDeleted";

describe("isAccountDeleted", () => {
  it("returns true when owner is null address", () => {
    expect(isAccountDeleted({ owner: NULL_ADDRESS } as any)).toBe(true);
  });
  it("returns false otherwise", () => {
    expect(isAccountDeleted({ owner: "0x1" } as any)).toBe(false);
  });
});
