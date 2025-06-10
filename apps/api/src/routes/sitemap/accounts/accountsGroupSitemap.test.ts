import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import { getRedis, setRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import accountsGroupSitemap from "./accountsGroupSitemap";

vi.mock("src/utils/lensPg", () => ({ default: { query: vi.fn() } }));
vi.mock("src/utils/redis", () => ({
  getRedis: vi.fn(),
  setRedis: vi.fn(),
  hoursToSeconds: vi.fn(() => 1)
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("accountsGroupSitemap", () => {
  it("returns cached value when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue("2");
    const header = vi.fn();
    const body = vi.fn((c: unknown) => c);
    const ctx = {
      req: { param: vi.fn(() => ({ "group.xml": "1.xml" })) },
      header,
      body
    } as unknown as Context;

    const result = await accountsGroupSitemap(ctx);

    expect(header).toHaveBeenCalledWith("Content-Type", "application/xml");
    expect(result).toContain("<sitemapindex");
    expect(lensPg.query).not.toHaveBeenCalled();
    expect(setRedis).not.toHaveBeenCalled();
  });

  it("queries db and caches when not cached", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (lensPg.query as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { count: 2 }
    ]);
    const header = vi.fn();
    const body = vi.fn((c: unknown) => c);
    const ctx = {
      req: { param: vi.fn(() => ({ "group.xml": "1.xml" })) },
      header,
      body
    } as unknown as Context;

    const result = await accountsGroupSitemap(ctx);

    expect(lensPg.query).toHaveBeenCalled();
    expect(setRedis).toHaveBeenCalled();
    expect(result).toContain("<sitemapindex");
  });
});
