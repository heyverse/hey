import { describe, expect, it } from "vitest";
import trimify from "./trimify";

describe("trimify", () => {
  it("removes extra newlines and trims", () => {
    const input = "a\n\n\n b \n";
    expect(trimify(input)).toBe("a\n\n b");
  });
});
