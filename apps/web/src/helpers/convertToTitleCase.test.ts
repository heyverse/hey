import { describe, expect, it } from "vitest";
import convertToTitleCase from "./convertToTitleCase";

describe("convertToTitleCase", () => {
  it("handles snake case", () => {
    expect(convertToTitleCase("hello_world")).toBe("Hello World");
  });

  it("handles camel case", () => {
    expect(convertToTitleCase("helloWorld")).toBe("Hello World");
  });

  it("handles uppercase", () => {
    expect(convertToTitleCase("FOO")).toBe("F O O");
  });
});
