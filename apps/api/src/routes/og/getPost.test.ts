import type { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getPost from "./getPost";
import "@hey/indexer/apollo/client";
import "@hey/helpers/getAccount";
import "@hey/helpers/getAvatar";
import "@hey/helpers/getPostData";
import { getRedis, setRedis } from "src/utils/redis";

vi.mock("@hey/indexer/apollo/client", () => ({
  default: {
    query: vi.fn(async () => ({
      data: {
        post: {
          __typename: "Post",
          slug: "slug",
          author: {},
          metadata: {},
          stats: {
            collects: 1,
            tips: 2,
            comments: 3,
            reactions: 4,
            reposts: 5,
            quotes: 6
          }
        }
      }
    }))
  }
}));
vi.mock("@hey/helpers/getAccount", () => ({
  default: vi.fn(() => ({ usernameWithPrefix: "@alice" }))
}));
vi.mock("@hey/helpers/getAvatar", () => ({ default: vi.fn(() => "avatar") }));
vi.mock("@hey/helpers/getPostData", () => ({
  default: vi.fn(() => ({ content: "Hello" }))
}));
vi.mock("src/utils/redis", () => ({ getRedis: vi.fn(), setRedis: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("og getPost route", () => {
  it("generates html and caches result", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const html = vi.fn((b: string) => b);
    const ctx = {
      req: { param: vi.fn(() => ({ slug: "slug" })) },
      html
    } as unknown as Context;

    const result = await getPost(ctx);

    expect(html).toHaveBeenCalled();
    expect(String(result)).toContain("Post by @alice on Hey");
    expect(setRedis).toHaveBeenCalled();
  });

  it("returns cached html when available", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "cached"
    );
    const html = vi.fn((b: string) => b);
    const ctx = {
      req: { param: vi.fn(() => ({ slug: "slug" })) },
      html
    } as unknown as Context;

    const result = await getPost(ctx);

    expect(result).toBe("cached");
    expect(setRedis).not.toHaveBeenCalled();
  });
});
