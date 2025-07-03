import { describe, expect, it } from "vitest";
import convertToTitleCase from "./convertToTitleCase";

describe("convertToTitleCase", () => {
  it("converts snake_case to title case", () => {
    expect(convertToTitleCase("follower_count")).toBe("Follower Count");
    expect(convertToTitleCase("USER_NAME")).toBe("User Name");
  });

  it("converts camelCase and PascalCase to title case", () => {
    expect(convertToTitleCase("postLikes")).toBe("Post Likes");
    expect(convertToTitleCase("ShareCount")).toBe("Share Count");
  });

  it("handles single word strings", () => {
    expect(convertToTitleCase("trend")).toBe("Trend");
  });
});
