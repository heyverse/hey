import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import formatRelativeOrAbsolute from "./formatRelativeOrAbsolute";

describe("formatRelativeOrAbsolute", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats seconds ago", () => {
    vi.setSystemTime(new Date("2023-05-10T12:00:00Z"));
    expect(formatRelativeOrAbsolute(new Date("2023-05-10T11:59:30Z"))).toBe(
      "30s"
    );
  });

  it("formats minutes ago", () => {
    vi.setSystemTime(new Date("2023-05-10T12:00:00Z"));
    expect(formatRelativeOrAbsolute(new Date("2023-05-10T11:58:00Z"))).toBe(
      "2m"
    );
  });

  it("formats hours ago", () => {
    vi.setSystemTime(new Date("2023-05-10T12:00:00Z"));
    expect(formatRelativeOrAbsolute(new Date("2023-05-10T09:00:00Z"))).toBe(
      "3h"
    );
  });

  it("formats days under a week", () => {
    vi.setSystemTime(new Date("2023-05-10T12:00:00Z"));
    expect(formatRelativeOrAbsolute(new Date("2023-05-05T12:00:00Z"))).toBe(
      "5d"
    );
  });

  it("formats absolute date in same year", () => {
    vi.setSystemTime(new Date("2023-05-10T12:00:00Z"));
    expect(formatRelativeOrAbsolute(new Date("2023-04-30T12:00:00Z"))).toBe(
      "Apr 30"
    );
  });

  it("formats absolute date in different year", () => {
    vi.setSystemTime(new Date("2023-05-10T12:00:00Z"));
    expect(formatRelativeOrAbsolute(new Date("2022-04-05T12:00:00Z"))).toBe(
      "Apr 5, 2022"
    );
  });
});
