import { describe, expect, it } from "vitest";
import formatAddress from "./formatAddress";

const address = "0x1234567890abcdef1234567890abcdef12345678";

describe("formatAddress", () => {
  it("returns empty string for null", () => {
    expect(formatAddress(null)).toBe("");
  });

  it("formats valid address", () => {
    expect(formatAddress(address)).toBe("0x12…5678");
  });

  it("uses custom slice size", () => {
    expect(formatAddress(address, 6)).toBe("0x1234…345678");
  });

  it("lowercases invalid address", () => {
    expect(formatAddress("NOTanADDRESS")).toBe("notanaddress");
  });

  it("handles slice size exceeding address length", () => {
    expect(formatAddress(address, 100)).toBe(`${address}…${address}`);
  });

  it("handles negative slice size", () => {
    expect(formatAddress(address, -1)).toBe(
      "0x1234567890abcdef1234567890abcdef1234567…"
    );
  });

  it("handles short ENS name gracefully", () => {
    expect(formatAddress("A.ETH")).toBe("a.eth");
  });
});
