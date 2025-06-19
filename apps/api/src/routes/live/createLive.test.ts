import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import createLive from "./createLive";

describe("live create route", () => {
  it("creates a live stream", async () => {
    process.env.LIVEPEER_KEY = "key";
    const fetchMock = vi.fn(async () => ({ json: async () => ({ id: "1" }) }));
    vi.stubGlobal("fetch", fetchMock);

    const ctx = {
      req: { json: vi.fn(async () => ({ record: true })) },
      get: vi.fn(() => "user"),
      json: vi.fn((body: unknown) => body)
    } as unknown as Context;

    const result = await createLive(ctx);

    expect(fetchMock).toHaveBeenCalled();
    expect(ctx.json).toHaveBeenCalledWith({
      status: Status.Success,
      data: { id: "1" }
    });
    expect(result).toEqual({ status: Status.Success, data: { id: "1" } });

    vi.unstubAllGlobals();
  });
});
