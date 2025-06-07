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
});
