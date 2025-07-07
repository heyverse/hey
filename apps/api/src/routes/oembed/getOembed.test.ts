import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getOembed from "./getOembed";

// Mock Redis utilities
vi.mock("@/utils/redis", () => ({
  generateExtraLongExpiry: vi.fn(() => 86400),
  getRedis: vi.fn(),
  setRedis: vi.fn()
}));

// Mock getMetadata
vi.mock("./helpers/getMetadata", () => ({
  default: vi.fn()
}));

// Mock SHA256 utility
vi.mock("../../utils/sha256", () => ({
  default: vi.fn(() => "mocked-hash")
}));

// Mock handleApiError
vi.mock("../../utils/handleApiError", () => ({
  default: vi.fn((ctx, error) => ctx.json({ error: error.message }, 500))
}));

import { getRedis, setRedis } from "../../utils/redis";
import getMetadata from "./helpers/getMetadata";

describe("getOembed", () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.get("/", getOembed);
  });

  it("should return cached result when available", async () => {
    const cachedData = {
      description: "Cached Description",
      title: "Cached Title",
      url: "https://example.com"
    };

    (getRedis as any).mockResolvedValue(JSON.stringify(cachedData));

    const response = await app.request("/?url=https://example.com");
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      cached: true,
      data: cachedData,
      status: "success"
    });
    expect(getRedis).toHaveBeenCalledWith("oembed:mocked-hash");
    expect(getMetadata).not.toHaveBeenCalled();
  });

  it("should fetch and cache new metadata when not cached", async () => {
    const metadata = {
      description: "Fresh Description",
      title: "Fresh Title",
      url: "https://example.com"
    };

    (getRedis as any).mockResolvedValue(null);
    (getMetadata as any).mockResolvedValue(metadata);

    const response = await app.request("/?url=https://example.com");
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      data: metadata,
      status: "success"
    });

    expect(getRedis).toHaveBeenCalledWith("oembed:mocked-hash");
    expect(getMetadata).toHaveBeenCalledWith("https://example.com");
    expect(setRedis).toHaveBeenCalledWith(
      "oembed:mocked-hash",
      metadata,
      86400
    );
  });

  it("should handle Redis errors gracefully", async () => {
    (getRedis as any).mockRejectedValue(new Error("Redis error"));

    const response = await app.request("/?url=https://example.com");

    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result).toHaveProperty("error");
  });

  it("should handle metadata fetch errors", async () => {
    (getRedis as any).mockResolvedValue(null);
    (getMetadata as any).mockRejectedValue(new Error("Fetch error"));

    const response = await app.request("/?url=https://example.com");

    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result).toHaveProperty("error");
  });

  it("should handle null metadata response", async () => {
    const metadata = {
      description: null,
      title: null,
      url: "https://example.com"
    };

    (getRedis as any).mockResolvedValue(null);
    (getMetadata as any).mockResolvedValue(metadata);

    const response = await app.request("/?url=https://example.com");
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      data: metadata,
      status: "success"
    });
  });

  it("should handle malformed cached data", async () => {
    const metadata = {
      description: "Fresh Description",
      title: "Fresh Title",
      url: "https://example.com"
    };

    (getRedis as any).mockResolvedValue("invalid json");
    (getMetadata as any).mockResolvedValue(metadata);

    const response = await app.request("/?url=https://example.com");

    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result).toHaveProperty("error");
  });

  it("should handle URLs with special characters", async () => {
    const specialUrl = "https://example.com/page?q=test&foo=bar#section";
    const metadata = {
      description: "Special URL Description",
      title: "Special URL Title",
      url: specialUrl
    };

    (getRedis as any).mockResolvedValue(null);
    (getMetadata as any).mockResolvedValue(metadata);

    const response = await app.request(
      `/?url=${encodeURIComponent(specialUrl)}`
    );
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      data: metadata,
      status: "success"
    });
    expect(getMetadata).toHaveBeenCalledWith(specialUrl);
  });

  it("should handle empty metadata gracefully", async () => {
    const metadata = {};

    (getRedis as any).mockResolvedValue(null);
    (getMetadata as any).mockResolvedValue(metadata);

    const response = await app.request("/?url=https://example.com");
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      data: metadata,
      status: "success"
    });
  });
});
