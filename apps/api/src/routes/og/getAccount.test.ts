import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getAccount from "./getAccount";
import "@hey/helpers/getAccount";
import "@hey/helpers/getAvatar";
import defaultMetadata from "src/utils/defaultMetadata";
import { getRedis, setRedis } from "src/utils/redis";

vi.mock("@hey/indexer/apollo/client", () => ({
  default: {
    query: vi.fn(async () => ({
      data: { account: { metadata: { bio: "bio" } } }
    }))
  }
}));
vi.mock("@hey/helpers/getAccount", () => ({
  default: vi.fn(() => ({
    name: "Alice",
    link: "/u/alice",
    usernameWithPrefix: "@alice"
  }))
}));
vi.mock("@hey/helpers/getAvatar", () => ({ default: vi.fn(() => "avatar") }));
vi.mock("src/utils/redis", () => ({ getRedis: vi.fn(), setRedis: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("og getAccount route", () => {
  it("generates html and caches result", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const html = vi.fn((b: string) => b);
    const ctx = {
      req: { param: vi.fn(() => ({ username: "alice" })) },
      html
    } as unknown as Context;

    const result = await getAccount(ctx);

    expect(html).toHaveBeenCalled();
    expect(String(result)).toContain("Alice (@alice) on Hey");
    expect(setRedis).toHaveBeenCalled();
  });

  it("returns cached html when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "cached"
    );
    const html = vi.fn((b: string) => b);
    const ctx = {
      req: { param: vi.fn(() => ({ username: "alice" })) },
      html
    } as unknown as Context;

    const result = await getAccount(ctx);

    expect(result).toBe("cached");
    expect(setRedis).not.toHaveBeenCalled();
  });

  it("returns default metadata when apollo query fails", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (
      apolloClient.query as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error("fail"));
    const html = vi.fn((b: string) => b);
    const ctx = {
      req: { param: vi.fn(() => ({ username: "alice" })) },
      html
    } as unknown as Context;

    const result = await getAccount(ctx);

    expect(html).toHaveBeenCalledWith(defaultMetadata, 500);
    expect(result).toBe(defaultMetadata);
  });

  it("handles redis errors gracefully", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("fail")
    );
    const html = vi.fn((b: string) => b);
    const ctx = {
      req: { param: vi.fn(() => ({ username: "alice" })) },
      html
    } as unknown as Context;

    const result = await getAccount(ctx);

    expect(html).toHaveBeenCalledWith(defaultMetadata, 500);
    expect(result).toBe(defaultMetadata);
  });
});
