import { describe, expect, it } from "vitest";
import {
  generateExtraLongExpiry,
  generateSmallExpiry,
  hoursToSeconds
} from "./redis";

describe("redis utils", () => {
  it("converts hours to seconds", () => {
    expect(hoursToSeconds(1)).toBe(3600);
  });

  it("generates small expiry within range", () => {
    const value = generateSmallExpiry();
    expect(value).toBeGreaterThanOrEqual(hoursToSeconds(24));
    expect(value).toBeLessThanOrEqual(hoursToSeconds(48));
  });

  it("generates extra long expiry within range", () => {
    const value = generateExtraLongExpiry();
    expect(value).toBeGreaterThanOrEqual(hoursToSeconds(8 * 24));
    expect(value).toBeLessThanOrEqual(hoursToSeconds(10 * 24));
  });
});
