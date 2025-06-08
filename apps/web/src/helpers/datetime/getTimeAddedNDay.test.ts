import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import getTimeAddedNDay from "./getTimeAddedNDay";

describe("getTimeAddedNDay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds days in UTC", () => {
    vi.setSystemTime(new Date("2023-05-05T00:00:00Z"));
    expect(getTimeAddedNDay(7)).toBe("2023-05-12T00:00:00Z");
  });
});
