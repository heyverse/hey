import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import prisma from "src/prisma/client";
import { getRedis, setRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getPreferences from "./getPreferences";

vi.mock("src/prisma/client", () => ({
  default: { preference: { findUnique: vi.fn() } }
}));
vi.mock("src/utils/redis", () => ({ getRedis: vi.fn(), setRedis: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getPreferences route", () => {
  it("returns cached value when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      '{"appIcon":1,"includeLowScore":true}'
    );
    const ctx = {
      get: vi.fn(() => "0x1"),
      json: vi.fn((b: unknown) => b)
    } as unknown as Context;

    const result = await getPreferences(ctx);

    expect(ctx.json).toHaveBeenCalledWith({
      status: Status.Success,
      cached: true,
      data: { appIcon: 1, includeLowScore: true }
    });
    expect(result).toEqual({
      status: Status.Success,
      cached: true,
      data: { appIcon: 1, includeLowScore: true }
    });
    expect(prisma.preference.findUnique).not.toHaveBeenCalled();
  });

  it("fetches from db and caches when not cached", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (
      prisma.preference.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ appIcon: 2, includeLowScore: false });
    const ctx = {
      get: vi.fn(() => "0x1"),
      json: vi.fn((b: unknown) => b)
    } as unknown as Context;

    const result = await getPreferences(ctx);

    expect(prisma.preference.findUnique).toHaveBeenCalledWith({
      where: { accountAddress: "0x1" }
    });
    expect(setRedis).toHaveBeenCalled();
    expect(ctx.json).toHaveBeenCalledWith({
      status: Status.Success,
      data: { appIcon: 2, includeLowScore: false }
    });
    expect(result).toEqual({
      status: Status.Success,
      data: { appIcon: 2, includeLowScore: false }
    });
  });
});
