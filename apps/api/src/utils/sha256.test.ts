import { describe, expect, it } from "vitest";
import sha256 from "./sha256";

describe("sha256", () => {
  it("hashes text correctly", () => {
    expect(sha256("hello")).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    );
  });
});
