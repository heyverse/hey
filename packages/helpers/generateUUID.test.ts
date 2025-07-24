import { beforeEach, describe, expect, it } from "vitest";
import generateUUID from "./generateUUID";

let callCount = 0;

const asyncGenerate = async () => {
  callCount += 1;
  return generateUUID();
};

describe("generateUUID", () => {
  beforeEach(() => {
    callCount = 0;
  });
  it("returns a valid UUID for post identifiers", () => {
    const id = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it("generates unique identifiers for different social media posts", () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    expect(id1).not.toBe(id2);
  });

  it("generates unique IDs in concurrent async calls", async () => {
    const ids = await Promise.all([
      asyncGenerate(),
      asyncGenerate(),
      asyncGenerate()
    ]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(callCount).toBe(3);
  });
});
