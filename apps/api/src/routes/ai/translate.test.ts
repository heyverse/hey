import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import openRouter from "src/utils/openRouter";
import { getRedis, setRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import translate from "./translate";

vi.mock("src/utils/redis", () => ({
  getRedis: vi.fn(),
  setRedis: vi.fn(),
  generateExtraLongExpiry: vi.fn(() => 10)
}));
vi.mock("src/utils/lensPg", () => ({ default: { query: vi.fn() } }));
vi.mock("src/utils/openRouter", () => ({
  default: { chat: { completions: { create: vi.fn() } } }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ai translate route", () => {
  it("returns cached translation when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "cached"
    );
    const json = vi.fn((b: unknown) => b);
    const ctx = {
      req: { json: vi.fn(async () => ({ post: "1" })) },
      json
    } as unknown as Context;

    const result = await translate(ctx);

    expect(json).toHaveBeenCalledWith({
      success: true,
      data: { text: "cached" }
    });
    expect(result).toEqual({ success: true, data: { text: "cached" } });
    expect(lensPg.query).not.toHaveBeenCalled();
    expect(
      openRouter.chat.completions.create as unknown as ReturnType<typeof vi.fn>
    ).not.toHaveBeenCalled();
    expect(setRedis).not.toHaveBeenCalled();
  });

  it("looks up text, translates and caches when not cached", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (lensPg.query as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { content: "Hola" }
    ]);
    (
      openRouter.chat.completions.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ choices: [{ message: { content: "Hello" } }] });
    const json = vi.fn((b: unknown) => b);
    const ctx = {
      req: { json: vi.fn(async () => ({ post: "1" })) },
      json
    } as unknown as Context;

    const result = await translate(ctx);

    expect(lensPg.query).toHaveBeenCalled();
    expect(
      openRouter.chat.completions.create as unknown as ReturnType<typeof vi.fn>
    ).toHaveBeenCalled();
    expect(setRedis).toHaveBeenCalledWith("ai:translate:1", "Hello", 10);
    expect(json).toHaveBeenCalledWith({
      success: true,
      data: { text: "Hello" }
    });
    expect(result).toEqual({ success: true, data: { text: "Hello" } });
  });
});
