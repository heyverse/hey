import { describe, expect, it } from "vitest";
import trimify from "./trimify";

describe("trimify", () => {
  it("trims spaces around a post", () => {
    const post = "  Hello world  ";
    expect(trimify(post)).toBe("Hello world");
  });

  it("collapses multiple blank lines within a post", () => {
    const post = "First line\n\n   \nSecond line";
    expect(trimify(post)).toBe("First line\n\nSecond line");
  });

  it("leaves already clean text unchanged", () => {
    const post = "Just a single line";
    expect(trimify(post)).toBe("Just a single line");
  });

  it("handles trailing newlines from comments", () => {
    const comment = "Nice post!\n\n";
    expect(trimify(comment)).toBe("Nice post!");
  });
});
