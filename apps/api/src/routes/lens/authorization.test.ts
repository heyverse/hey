import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authorization from "./authorization";

const createCtx = (auth?: string) => {
  const headers = new Headers();
  if (auth) headers.set("authorization", auth);
  return {
    req: { raw: { headers } },
    json: vi.fn((body: unknown, status?: number) => ({ body, status }))
  } as unknown as Context;
};

describe("lens authorization route", () => {
  const secret = "secret";
  const key = "0xabc";
  beforeEach(() => {
    process.env.SHARED_SECRET = secret;
    process.env.PRIVATE_KEY = key;
  });

  it("rejects missing header", async () => {
    const ctx = createCtx();
    const result = await authorization(ctx);
    expect(ctx.json).toHaveBeenCalledWith(
      { status: Status.Error, error: "Unauthorized" },
      401
    );
    expect(result).toEqual({
      body: { status: Status.Error, error: "Unauthorized" },
      status: 401
    });
  });

  it("rejects invalid secret", async () => {
    const ctx = createCtx("Bearer wrong");
    const result = await authorization(ctx);
    expect(ctx.json).toHaveBeenCalledWith(
      { status: Status.Error, error: "Invalid shared secret" },
      401
    );
    expect(result).toEqual({
      body: { status: Status.Error, error: "Invalid shared secret" },
      status: 401
    });
  });

  it("accepts valid secret", async () => {
    const ctx = createCtx(`Bearer ${secret}`);
    const result = await authorization(ctx);
    expect(ctx.json).toHaveBeenCalledWith({
      allowed: true,
      sponsored: true,
      signingKey: key
    });
    expect(result).toEqual({
      body: { allowed: true, sponsored: true, signingKey: key },
      status: undefined
    });
  });
});
