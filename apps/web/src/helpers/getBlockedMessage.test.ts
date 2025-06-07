import { LENS_NAMESPACE } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import {
  getBlockedByMeMessage,
  getBlockedMeMessage
} from "./getBlockedMessage";

const account = {
  address: "0x1",
  owner: "0x1",
  username: { value: `${LENS_NAMESPACE}alice`, localName: "alice" }
} as AccountFragment;

describe("getBlockedMessage", () => {
  it("formats blocked by me message", () => {
    expect(getBlockedByMeMessage(account)).toBe("You have blocked @alice");
  });

  it("formats blocked me message", () => {
    expect(getBlockedMeMessage(account)).toBe("@alice has blocked you");
  });
});
