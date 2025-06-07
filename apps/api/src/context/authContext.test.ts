import type { Context, Next } from "hono";
import { describe, expect, it, vi } from "vitest";
import authContext from "./authContext";

const createToken = (payload: object) => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");
  return `a.${encoded}.b`;
};

describe("authContext", () => {
  it("stores account and token when valid", async () => {
    const token = createToken({
      sub: "",
      exp: 0,
      sid: "",
      act: { sub: "user" }
    });
    const headers = new Headers({ "X-Access-Token": token });
    const ctx = {
      req: { raw: { headers } },
      set: vi.fn()
    } as unknown as Context;
    const next: Next = vi.fn();

    await authContext(ctx, next);

    expect(ctx.set).toHaveBeenCalledWith("account", "user");
    expect(ctx.set).toHaveBeenCalledWith("token", token);
  });

  it("clears values when token invalid", async () => {
    const headers = new Headers({ "X-Access-Token": "invalid" });
    const ctx = {
      req: { raw: { headers } },
      set: vi.fn()
    } as unknown as Context;
    const next: Next = vi.fn();

    await authContext(ctx, next);

    expect(ctx.set).toHaveBeenCalledWith("account", null);
    expect(ctx.set).toHaveBeenCalledWith("token", null);
  });
});
