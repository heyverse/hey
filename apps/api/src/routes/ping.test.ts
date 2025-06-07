import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import ping from "./ping";

describe("ping route", () => {
  it("returns pong", async () => {
    const jsonMock = vi.fn((body: unknown) => body);
    const ctx = { json: jsonMock } as unknown as Context;

    const result = await ping(ctx);

    expect(jsonMock).toHaveBeenCalledWith({ ping: "pong" });
    expect(result).toEqual({ ping: "pong" });
  });
});
