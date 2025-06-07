import { describe, expect, it, vi } from "vitest";
import sha256 from "../../utils/sha256";

vi.mock("hono-rate-limiter", () => ({
  rateLimiter: vi.fn((opts) => opts)
}));

import rateLimiter from "../rateLimiter";

const headers = new Headers({ "x-forwarded-for": "1.1.1.1" });

describe("rateLimiter", () => {
  it("generates key based on url and ip", () => {
    const middleware = rateLimiter({ requests: 1 }) as any;
    const ctx = { req: { url: "/test", raw: { headers } } } as any;
    const key = middleware.keyGenerator(ctx);
    const expected = `rate-limit:${sha256("/test").slice(0, 25)}:${sha256("1.1.1.1").slice(0, 25)}`;
    expect(key).toBe(expected);
  });
});
