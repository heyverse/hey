import { describe, expect, it } from "vitest";
import cn from "./cn";

describe("cn", () => {
  it("merges class names and removes duplicates", () => {
    expect(cn("p-2", "p-4", "p-2")).toBe("p-2");
  });

  it("ignores falsy values", () => {
    expect(cn("text-sm", null as any, undefined as any, false as any)).toBe(
      "text-sm"
    );
  });
});
