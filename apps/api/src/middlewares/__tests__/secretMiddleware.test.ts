import type { Context, Next } from "hono";
import { describe, expect, it, vi } from "vitest";
import secretMiddleware from "../secretMiddleware";

const next: Next = vi.fn();

describe("secretMiddleware", () => {
  it("returns 401 when secret invalid", async () => {
    process.env.SHARED_SECRET = "top";
    const body = vi.fn();
    const ctx = {
      req: { query: vi.fn(() => "wrong") },
      body
    } as unknown as Context;

    await secretMiddleware(ctx, next);

    expect(body).toHaveBeenCalledWith("Unauthorized", 401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when secret valid", async () => {
    process.env.SHARED_SECRET = "secret";
    const ctx = {
      req: { query: vi.fn(() => "secret") }
    } as unknown as Context;

    await secretMiddleware(ctx, next);

    expect(next).toHaveBeenCalled();
  });
});
