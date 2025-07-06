import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import formatRelativeOrAbsolute from "./formatRelativeOrAbsolute";

describe("formatRelativeOrAbsolute", () => {
  const now = new Date("2024-05-15T12:00:00Z");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("formats seconds ago", () => {
    const date = new Date(now.getTime() - 30 * 1000);
    expect(formatRelativeOrAbsolute(date)).toBe("30s");
  });

  it("formats minutes ago", () => {
    const date = new Date(now.getTime() - 3 * 60 * 1000);
    expect(formatRelativeOrAbsolute(date)).toBe("3m");
  });

  it("formats hours ago", () => {
    const date = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(formatRelativeOrAbsolute(date)).toBe("2h");
  });

  it("formats days ago within a week", () => {
    const date = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    expect(formatRelativeOrAbsolute(date)).toBe("5d");
  });

  it("formats more than a week in same year", () => {
    const date = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    expect(formatRelativeOrAbsolute(date)).toBe("May 1");
  });

  it("formats dates from previous year", () => {
    const date = new Date("2023-12-20T12:00:00Z");
    expect(formatRelativeOrAbsolute(date)).toBe("Dec 20, 2023");
  });
});
