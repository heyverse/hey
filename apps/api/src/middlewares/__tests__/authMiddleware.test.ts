import type { Context, Next } from "hono";
import { jwtVerify } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authMiddleware from "../authMiddleware";

vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn(() => "jwk"),
  jwtVerify: vi.fn()
}));

const next: Next = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authMiddleware", () => {
  it("calls next on valid token", async () => {
    (jwtVerify as unknown as any).mockResolvedValueOnce({});
    const ctx = { get: vi.fn(() => "token") } as unknown as Context;
    await authMiddleware(ctx, next);
    expect(jwtVerify).toHaveBeenCalledWith("token", "jwk");
    expect(next).toHaveBeenCalled();
  });

  it("returns 401 on invalid token", async () => {
    (jwtVerify as unknown as any).mockRejectedValueOnce(new Error("bad"));
    const body = vi.fn();
    const ctx = { get: vi.fn(() => "token"), body } as unknown as Context;
    await authMiddleware(ctx, next);
    expect(body).toHaveBeenCalledWith("Unauthorized", 401);
    expect(next).not.toHaveBeenCalled();
  });
});
