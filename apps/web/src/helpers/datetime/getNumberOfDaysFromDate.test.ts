import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getNumberOfDaysFromDate from "./getNumberOfDaysFromDate";

describe("getNumberOfDaysFromDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns positive difference for future dates", () => {
    vi.setSystemTime(new Date("2023-05-05T00:00:00Z"));
    expect(getNumberOfDaysFromDate(new Date("2023-05-10T00:00:00Z"))).toBe(5);
  });

  it("returns negative difference for past dates", () => {
    vi.setSystemTime(new Date("2023-05-05T00:00:00Z"));
    expect(getNumberOfDaysFromDate(new Date("2023-05-02T00:00:00Z"))).toBe(-3);
  });
});
