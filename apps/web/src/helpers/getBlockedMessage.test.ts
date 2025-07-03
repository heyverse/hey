import { LENS_NAMESPACE } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import {
  getBlockedByMeMessage,
  getBlockedMeMessage
} from "./getBlockedMessage";

describe("getBlockedMessage", () => {
  it("returns message when current user blocked another account", () => {
    const account = {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      owner: "0x01",
      username: {
        localName: "janedoe",
        value: `${LENS_NAMESPACE}janedoe`
      }
    } as unknown as AccountFragment;

    const result = getBlockedByMeMessage(account);
    expect(result).toBe("You have blocked @janedoe");
  });

  it("returns message when another account blocked the user", () => {
    const account = {
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      owner: "0x01",
      username: {
        localName: "alice",
        value: `${LENS_NAMESPACE}alice`
      }
    } as unknown as AccountFragment;

    const result = getBlockedMeMessage(account);
    expect(result).toBe("@alice has blocked you");
  });

  it("uses address when username is missing", () => {
    const address = "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd";
    const account = {
      address,
      owner: "0x01"
    } as unknown as AccountFragment;

    const result = getBlockedMeMessage(account);
    expect(result).toBe("#0xab…abcd has blocked you");
  });
});
