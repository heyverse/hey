import { describe, expect, it } from "vitest";
import cn from "./cn";

describe("cn", () => {
  it("combines post classes", () => {
    expect(cn("post", "rounded", "shadow")).toBe("post rounded shadow");
  });

  it("overrides conflicting styles", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles like button state", () => {
    const liked = true;
    expect(cn("like-button", "text-gray-500", liked && "text-red-500")).toBe(
      "like-button text-red-500"
    );
  });
});
