import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockHtml = `<html><head><meta property="og:title" content="Post" /></head></html>`;

vi.mock("./ogUtils", () => ({
  default: vi.fn(async ({ ctx }) => ctx.html(mockHtml, 200))
}));

import getPost from "./getPost";

describe("getPost", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.get("/posts/:slug", getPost);
  });

  it("returns og html", async () => {
    const res = await app.request("/posts/example");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain("og:title");
  });
});
