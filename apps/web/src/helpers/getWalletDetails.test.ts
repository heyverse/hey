import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import getWalletDetails from "./getWalletDetails";

describe("getWalletDetails", () => {
  it("returns family account provider details", () => {
    const result = getWalletDetails("familyAccountsProvider");
    expect(result).toEqual({
      logo: `${STATIC_IMAGES_URL}/wallets/family.png`,
      name: "Login with Family"
    });
  });

  it("returns injected wallet details", () => {
    const result = getWalletDetails("injected");
    expect(result).toEqual({
      logo: `${STATIC_IMAGES_URL}/wallets/wallet.svg`,
      name: "Browser Wallet"
    });
  });

  it("returns wallet connect details", () => {
    const result = getWalletDetails("walletConnect");
    expect(result).toEqual({
      logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`,
      name: "Wallet Connect"
    });
  });
});
