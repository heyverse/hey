import { describe, expect, it } from "vitest";
import getWalletDetails from "./getWalletDetails";

describe("getWalletDetails", () => {
  it("returns details for walletConnect", () => {
    expect(getWalletDetails("walletConnect")).toMatchObject({
      name: "Wallet Connect"
    });
  });

  it("returns details for injected", () => {
    expect(getWalletDetails("injected")).toMatchObject({
      name: "Browser Wallet"
    });
  });
});
