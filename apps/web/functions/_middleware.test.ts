import { afterEach, describe, expect, it, vi } from "vitest";
import { type Context, onRequest } from "./_middleware";

const createResponse = () =>
  new Response("ok", { status: 200, headers: { x: "y" } });

const stubFetch = () => {
  const fetchMock = vi.fn(async () => createResponse());
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const createContext = (url: string, ua = ""): Context => {
  const headers = new Headers();
  if (ua) headers.set("user-agent", ua);
  const request = new Request(url, { headers });
  return { request, next: vi.fn() };
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("onRequest middleware", () => {
  it("rewrites sitemap root", async () => {
    const fetchMock = stubFetch();
    const ctx = createContext("https://hey.xyz/sitemap.xml");
    const res = await onRequest(ctx);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.hey.xyz/sitemap/all.xml",
      expect.any(Object)
    );
    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });

  it("rewrites sitemap paths", async () => {
    const fetchMock = stubFetch();
    const ctx = createContext("https://hey.xyz/sitemap/posts.xml");
    await onRequest(ctx);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.hey.xyz/sitemap/posts.xml",
      expect.any(Object)
    );
  });

  it("rewrites og paths for bots", async () => {
    const fetchMock = stubFetch();
    const ctx = createContext("https://hey.xyz/posts/123", "Googlebot");
    await onRequest(ctx);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.hey.xyz/og/posts/123",
      expect.any(Object)
    );
  });
});
