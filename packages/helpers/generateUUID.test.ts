import { describe, expect, it } from "vitest";
import generateUUID from "./generateUUID";

describe("generateUUID", () => {
  it("creates a valid v4 UUID", () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("creates unique v4 UUIDs", () => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i += 1) {
      const uuid = generateUUID();
      expect(uuid).toMatch(regex);
      uuids.add(uuid);
    }
    expect(uuids.size).toBe(100);
  });
});
