import type { Context } from "hono";
import { CACHE_AGE_1_DAY } from "src/utils/constants";
import { getRedis, setRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getOembed from "./getOembed";
import getMetadata from "./helpers/getMetadata";

vi.mock("./helpers/getMetadata", () => ({
  default: vi.fn(async () => ({
    title: "Title",
    description: "Desc",
    url: "https://x"
  }))
}));
vi.mock("src/utils/redis", () => ({
  getRedis: vi.fn(),
  setRedis: vi.fn(),
  generateExtraLongExpiry: vi.fn(() => 100)
}));
vi.mock("src/utils/sha256", () => ({ default: vi.fn(() => "hash") }));

describe("oembed getOembed route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cached value when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      '{"foo":"bar"}'
    );
    const header = vi.fn();
    const json = vi.fn((body: unknown) => body);
    const ctx = {
      req: { query: vi.fn(() => ({ url: "https://x" })) },
      header,
      json
    } as unknown as Context;

    const result = await getOembed(ctx);

    expect(header).toHaveBeenCalledWith("Cache-Control", CACHE_AGE_1_DAY);
    expect(json).toHaveBeenCalledWith({
      success: true,
      cached: true,
      data: { foo: "bar" }
    });
    expect(result).toEqual({
      success: true,
      cached: true,
      data: { foo: "bar" }
    });
  });

  it("fetches metadata and caches when not cached", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const header = vi.fn();
    const json = vi.fn((body: unknown) => body);
    const ctx = {
      req: { query: vi.fn(() => ({ url: "https://x" })) },
      header,
      json
    } as unknown as Context;

    const result = await getOembed(ctx);

    expect(getMetadata).toHaveBeenCalledWith("https://x");
    expect(setRedis).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: { title: "Title", description: "Desc", url: "https://x" }
    });
    expect(result).toEqual({
      success: true,
      data: { title: "Title", description: "Desc", url: "https://x" }
    });
  });
});
