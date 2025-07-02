import { describe, expect, it } from "vitest";
import formatAddress from "./formatAddress";

const sampleAddress = "0x1234567890ABCDEF1234567890abcdef12345678";

describe("formatAddress", () => {
  it("formats a valid address with default slice size", () => {
    const result = formatAddress(sampleAddress);
    expect(result).toBe("0x12…5678");
  });

  it("formats a valid address with custom slice size", () => {
    const result = formatAddress(sampleAddress, 6);
    expect(result).toBe("0x1234…345678");
  });

  it("returns an empty string for null address", () => {
    const result = formatAddress(null);
    expect(result).toBe("");
  });

  it("returns lowercase string for invalid address", () => {
    const result = formatAddress("NotAnAddress");
    expect(result).toBe("notanaddress");
  });
});
