import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockHtml = `<html><head><meta property="og:title" content="Account" /></head></html>`;

vi.mock("./ogUtils", () => ({
  default: vi.fn(async ({ ctx }) => ctx.html(mockHtml, 200))
}));

import getAccount from "./getAccount";

describe("getAccount", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.get("/u/:username", getAccount);
  });

  it("returns og html", async () => {
    const res = await app.request("/u/test");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain("og:title");
  });
});
