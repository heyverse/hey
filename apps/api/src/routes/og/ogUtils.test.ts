import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import { html, raw } from "hono/html";
import defaultMetadata from "src/utils/defaultMetadata";
import { getRedis, setRedis } from "src/utils/redis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import generateOg from "./ogUtils";

vi.mock("@hey/indexer/apollo/client", () => ({
  default: { query: vi.fn(async () => ({ data: { foo: "bar" } })) }
}));
vi.mock("src/utils/redis", () => ({ getRedis: vi.fn(), setRedis: vi.fn() }));

const template = (_: any, jsonLd: string) =>
  html`<html><script>${raw(jsonLd)}</script><body>bar</body></html>`;
const asyncTemplate = async (...args: Parameters<typeof template>) =>
  template(...args);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("generateOg", () => {
  it("returns cached value", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "cached"
    );
    const htmlFn = vi.fn((v: string) => v);
    const ctx = { html: htmlFn } as unknown as Context;

    const result = await generateOg({
      ctx,
      cacheKey: "k",
      query: {} as any,
      variables: {},
      extractData: (d) => d,
      buildJsonLd: () => ({}),
      buildHtml: template
    });

    expect(htmlFn).toHaveBeenCalledWith("cached", 200);
    expect(result).toBe("cached");
    expect(apolloClient.query).not.toHaveBeenCalled();
  });

  it("queries and caches result", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const htmlFn = vi.fn((v: string) => v);
    const ctx = { html: htmlFn } as unknown as Context;

    const result = await generateOg({
      ctx,
      cacheKey: "k",
      query: {} as any,
      variables: {},
      extractData: (d) => d,
      buildJsonLd: () => ({}),
      buildHtml: template
    });

    expect(apolloClient.query).toHaveBeenCalled();
    expect(setRedis).toHaveBeenCalled();
    expect(String(result)).toContain("bar");
  });

  it("supports async buildHtml", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const htmlFn = vi.fn((v: string) => v);
    const ctx = { html: htmlFn } as unknown as Context;

    const result = await generateOg({
      ctx,
      cacheKey: "k",
      query: {} as any,
      variables: {},
      extractData: (d) => d,
      buildJsonLd: () => ({}),
      buildHtml: asyncTemplate
    });

    expect(apolloClient.query).toHaveBeenCalled();
    expect(setRedis).toHaveBeenCalled();
    expect(String(result)).toContain("bar");
  });

  it("returns default metadata when data missing", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (
      apolloClient.query as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ data: {} });
    const htmlFn = vi.fn((v: any) => v);
    const ctx = { html: htmlFn } as unknown as Context;

    const result = await generateOg({
      ctx,
      cacheKey: "k",
      query: {} as any,
      variables: {},
      extractData: () => null,
      buildJsonLd: () => ({}),
      buildHtml: template
    });

    expect(htmlFn).toHaveBeenCalledWith(defaultMetadata, 404);
    expect(result).toBe(defaultMetadata);
  });

  it("handles errors gracefully", async () => {
    (getRedis as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("fail")
    );
    const htmlFn = vi.fn((v: any) => v);
    const ctx = { html: htmlFn } as unknown as Context;

    const result = await generateOg({
      ctx,
      cacheKey: "k",
      query: {} as any,
      variables: {},
      extractData: (d) => d,
      buildJsonLd: () => ({}),
      buildHtml: template
    });

    expect(htmlFn).toHaveBeenCalledWith(defaultMetadata, 500);
    expect(result).toBe(defaultMetadata);
  });
});
