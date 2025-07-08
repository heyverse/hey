import { describe, expect, it } from "vitest";
import formatAddress from "./formatAddress";

const sampleAddress = "0x1234567890ABCDEF1234567890abcdef12345678";

describe("formatAddress", () => {
  it("formats wallet address for user profile display", () => {
    const result = formatAddress(sampleAddress);
    expect(result).toBe("0x12…5678");
  });

  it("formats ENS address with custom length for NFT creator attribution", () => {
    const result = formatAddress(sampleAddress, 6);
    expect(result).toBe("0x1234…345678");
  });

  it("returns empty string when user has no connected wallet", () => {
    const result = formatAddress(null);
    expect(result).toBe("");
  });

  it("returns lowercase string for invalid wallet addresses in posts", () => {
    const result = formatAddress("NotAnAddress");
    expect(result).toBe("notanaddress");
  });
});
