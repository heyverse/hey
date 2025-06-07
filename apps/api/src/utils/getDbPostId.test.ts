import { describe, expect, it } from "vitest";
import getDbPostId from "./getDbPostId";

describe("getDbPostId", () => {
  it("converts decimal to hex prefix", () => {
    expect(getDbPostId("123456")).toBe("\\x1e240");
  });
});
