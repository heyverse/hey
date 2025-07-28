import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockHtml = `<html><head><meta property="og:title" content="Group" /></head></html>`;

vi.mock("./ogUtils", () => ({
  default: vi.fn(async ({ ctx }) => ctx.html(mockHtml, 200))
}));

import getGroup from "./getGroup";

describe("getGroup", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.get("/g/:address", getGroup);
  });

  it("returns og html", async () => {
    const res = await app.request("/g/0x1234");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain("og:title");
  });
});
