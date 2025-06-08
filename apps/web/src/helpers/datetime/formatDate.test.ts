import { describe, expect, it } from "vitest";
import formatDate from "./formatDate";

describe("formatDate", () => {
  it("formats date using default pattern", () => {
    expect(formatDate(new Date("2023-02-01T00:00:00Z"))).toBe(
      "February 1, 2023"
    );
  });

  it("formats date with custom pattern", () => {
    expect(formatDate("2024-12-25", "YYYY/MM/DD")).toBe("2024/12/25");
  });
});
