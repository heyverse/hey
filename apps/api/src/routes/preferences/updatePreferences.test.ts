import type { Context } from "hono";
import prisma from "src/prisma/client";
import { delRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import updatePreferences from "./updatePreferences";

vi.mock("src/prisma/client", () => ({
  default: { preference: { upsert: vi.fn() } }
}));
vi.mock("src/utils/redis", () => ({ delRedis: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updatePreferences route", () => {
  it("updates preferences and clears cache", async () => {
    (
      prisma.preference.upsert as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ appIcon: 3, includeLowScore: true });
    const ctx = {
      req: { json: vi.fn(async () => ({ appIcon: 3, includeLowScore: true })) },
      get: vi.fn(() => "0x1"),
      json: vi.fn((b: unknown) => b)
    } as unknown as Context;

    const result = await updatePreferences(ctx);

    expect(prisma.preference.upsert).toHaveBeenCalledWith({
      create: { appIcon: 3, includeLowScore: true, accountAddress: "0x1" },
      update: { appIcon: 3, includeLowScore: true },
      where: { accountAddress: "0x1" }
    });
    expect(delRedis).toHaveBeenCalledWith("preferences:0x1");
    expect(ctx.json).toHaveBeenCalledWith({
      success: true,
      data: { appIcon: 3, includeLowScore: true }
    });
    expect(result).toEqual({
      success: true,
      data: { appIcon: 3, includeLowScore: true }
    });
  });
});
