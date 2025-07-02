import { describe, expect, it } from "vitest";
import generateUUID from "./generateUUID";

describe("generateUUID", () => {
  it("returns a valid UUID", () => {
    const id = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it("generates unique values", () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    expect(id1).not.toBe(id2);
  });
});
