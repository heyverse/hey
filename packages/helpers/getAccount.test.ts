import { LENS_NAMESPACE, NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getAccount from "./getAccount";

const aliceAddress = "0x1234567890abcdef1234567890abcdef12345678";
const bobAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
const charlieAddress = "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd";

describe("getAccount", () => {
  it("returns default values when account is undefined", () => {
    const result = getAccount(undefined);
    expect(result).toEqual({
      link: "",
      name: "...",
      username: "...",
      usernameWithPrefix: "..."
    });
  });

  it("returns deleted account info", () => {
    const account = {
      owner: NULL_ADDRESS
    } as unknown as AccountFragment;

    const result = getAccount(account);
    expect(result).toEqual({
      link: "",
      name: "Deleted Account",
      username: "deleted",
      usernameWithPrefix: "@deleted"
    });
  });

  it("formats lens usernames and sanitizes name", () => {
    const account = {
      address: aliceAddress,
      metadata: { name: "Jane\u2714 Doe" },
      owner: "0x01",
      username: {
        localName: "janedoe",
        value: `${LENS_NAMESPACE}janedoe`
      }
    } as unknown as AccountFragment;

    const result = getAccount(account);
    expect(result).toEqual({
      link: "/u/janedoe",
      name: "Jane Doe",
      username: "janedoe",
      usernameWithPrefix: "@janedoe"
    });
  });

  it("builds link using address when username is outside lens", () => {
    const account = {
      address: bobAddress,
      metadata: { name: "Alice" },
      owner: "0x01",
      username: {
        localName: "alice",
        value: "alice"
      }
    } as unknown as AccountFragment;

    const result = getAccount(account);
    expect(result).toEqual({
      link: `/account/${bobAddress}`,
      name: "Alice",
      username: "alice",
      usernameWithPrefix: "@alice"
    });
  });

  it("uses address when username is missing", () => {
    const account = {
      address: charlieAddress,
      metadata: { name: "Bob" },
      owner: "0x01"
    } as unknown as AccountFragment;

    const result = getAccount(account);
    expect(result).toEqual({
      link: `/account/${charlieAddress}`,
      name: "Bob",
      username: "0xab…abcd",
      usernameWithPrefix: "#0xab…abcd"
    });
  });
});
