import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import { getRedis, setRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import accountSitemap from "./accountSitemap";

vi.mock("src/utils/lensPg", () => ({ default: { query: vi.fn() } }));
vi.mock("src/utils/redis", () => ({
  getRedis: vi.fn(),
  setRedis: vi.fn(),
  hoursToSeconds: vi.fn(() => 1)
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("accountSitemap", () => {
  it("returns cached usernames when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      '["bob"]'
    );
    const header = vi.fn();
    const body = vi.fn((c: unknown) => c);
    const ctx = {
      req: { param: vi.fn(() => ({ "batch.xml": "1.xml" })) },
      header,
      body
    } as unknown as Context;

    const result = await accountSitemap(ctx);

    expect(body).toHaveBeenCalled();
    expect(result).toContain("https://hey.xyz/u/bob");
    expect(lensPg.query).not.toHaveBeenCalled();
    expect(setRedis).not.toHaveBeenCalled();
  });

  it("queries db and caches when not cached", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (lensPg.query as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { local_name: "alice" }
    ]);
    const header = vi.fn();
    const body = vi.fn((c: unknown) => c);
    const ctx = {
      req: { param: vi.fn(() => ({ "batch.xml": "1.xml" })) },
      header,
      body
    } as unknown as Context;

    const result = await accountSitemap(ctx);

    expect(lensPg.query).toHaveBeenCalled();
    expect(setRedis).toHaveBeenCalled();
    expect(result).toContain("https://hey.xyz/u/alice");
  });
});
