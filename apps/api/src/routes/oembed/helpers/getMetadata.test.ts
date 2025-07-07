import { beforeEach, describe, expect, it, vi } from "vitest";
import getMetadata from "./getMetadata";

// Mock fetch
global.fetch = vi.fn();

describe("getMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract title and description from HTML", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Test Title">
          <meta property="og:description" content="Test Description">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: "Test Description",
      title: "Test Title",
      url: "https://example.com"
    });
  });

  it("should handle missing title and description", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta name="keywords" content="test">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://example.com"
    });
  });

  it("should handle network errors", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://example.com"
    });
  });

  it("should handle HTTP errors", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://example.com"
    });
  });

  it("should handle malformed HTML", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Test Title"
          <meta property="og:description"
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: null,
      title: "Test Title",
      url: "https://example.com"
    });
  });

  it("should handle empty HTML", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("")
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://example.com"
    });
  });

  it("should use correct User-Agent header", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Test Title">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    await getMetadata("https://example.com");

    expect(global.fetch).toHaveBeenCalledWith("https://example.com", {
      headers: {
        "User-Agent": "HeyBot (like TwitterBot)"
      }
    });
  });

  it("should handle Twitter meta tags when Open Graph is not available", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta name="twitter:title" content="Twitter Title">
          <meta name="twitter:description" content="Twitter Description">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: "Twitter Description",
      title: "Twitter Title",
      url: "https://example.com"
    });
  });

  it("should handle mixed meta tags", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="OG Title">
          <meta name="twitter:description" content="Twitter Description">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://example.com");

    expect(result).toEqual({
      description: "Twitter Description",
      title: "OG Title",
      url: "https://example.com"
    });
  });

  it("should handle fetch timeout", async () => {
    (global.fetch as any).mockImplementation(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 100)
        )
    );

    const result = await getMetadata("https://slow-example.com");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://slow-example.com"
    });
  });

  it("should handle special characters in URL", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Test Title">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://example.com/page?q=test&foo=bar");

    expect(result).toEqual({
      description: null,
      title: "Test Title",
      url: "https://example.com/page?q=test&foo=bar"
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com/page?q=test&foo=bar",
      {
        headers: {
          "User-Agent": "HeyBot (like TwitterBot)"
        }
      }
    );
  });
});
