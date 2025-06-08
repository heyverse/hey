import { describe, expect, it, vi } from "vitest";

// biome-ignore lint/style/noVar: mock variables initialized before imports
var unsafeMock: ReturnType<typeof vi.fn>;

vi.mock("postgres", () => {
  unsafeMock = vi.fn();
  return { default: () => ({ unsafe: unsafeMock }) };
});

import db from "./lensPg";

describe("lensPg", () => {
  it("calls query", async () => {
    await db.query("SELECT 1");
    expect(unsafeMock).toHaveBeenCalledWith("SELECT 1", []);
  });

  it("calls multi", async () => {
    await db.multi("SELECT 1");
    expect(unsafeMock).toHaveBeenCalledWith("SELECT 1", []);
  });
});
