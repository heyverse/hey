import { LENS_NAMESPACE, NULL_ADDRESS } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import formatAddress from "./formatAddress";
import getAccount from "./getAccount";

const address = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

// minimal account type
interface Account {
  owner: string;
  address: string;
  metadata?: { name?: string | null } | null;
  username?: { value: string; localName: string } | null;
}

describe("getAccount", () => {
  it("returns unknown account when undefined", () => {
    expect(getAccount()).toEqual({
      name: "...",
      link: "",
      username: "...",
      usernameWithPrefix: "..."
    });
  });

  it("returns deleted account", () => {
    const account: Account = { owner: NULL_ADDRESS, address };
    expect(getAccount(account as any)).toEqual({
      name: "Deleted Account",
      link: "",
      username: "deleted",
      usernameWithPrefix: "@deleted"
    });
  });

  it("handles lens username and sanitizes name", () => {
    const account: Account = {
      owner: "0x1",
      address,
      metadata: { name: "Alice✓" },
      username: { value: `${LENS_NAMESPACE}alice`, localName: "alice" }
    };
    expect(getAccount(account as any)).toEqual({
      name: "Alice",
      link: "/u/alice",
      username: "alice",
      usernameWithPrefix: "@alice"
    });
  });

  it("uses address when username missing", () => {
    const account: Account = { owner: "0x1", address };
    const formatted = formatAddress(address);
    expect(getAccount(account as any)).toEqual({
      name: formatted,
      link: `/account/${address}`,
      username: formatted,
      usernameWithPrefix: `#${formatted}`
    });
  });
});
