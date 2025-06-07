import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import pagesSitemap from "./pagesSitemap";

describe("sitemap pages", () => {
  it("returns xml", async () => {
    const header = vi.fn();
    const body = vi.fn((content: unknown) => content);
    const ctx = { header, body } as unknown as Context;

    const result = await pagesSitemap(ctx);

    expect(header).toHaveBeenCalledWith("Content-Type", "application/xml");
    expect(typeof result).toBe("string");
    expect(result).toContain("<urlset");
  });
});
