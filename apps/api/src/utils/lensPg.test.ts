import { describe, expect, it, vi } from "vitest";

// biome-ignore lint/style/noVar: mock variables initialized before imports
var queryMock: ReturnType<typeof vi.fn>;
// biome-ignore lint/style/noVar: mock variables initialized before imports
var multiMock: ReturnType<typeof vi.fn>;

vi.mock("pg-promise", () => {
  queryMock = vi.fn();
  multiMock = vi.fn();
  return {
    default: () => {
      const pgp = () => ({ query: queryMock, multi: multiMock });
      pgp.helpers = {} as unknown;
      pgp.as = {} as unknown;
      return pgp;
    }
  };
});

import db from "./lensPg";

describe("lensPg", () => {
  it("calls query", async () => {
    await db.query("SELECT 1");
    expect(queryMock).toHaveBeenCalledWith("SELECT 1", null);
  });

  it("calls multi", async () => {
    await db.multi("SELECT 1");
    expect(multiMock).toHaveBeenCalledWith("SELECT 1", null);
  });
});
