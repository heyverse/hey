import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import getTitle from "./getTitle";

describe("getTitle", () => {
  it("should extract Open Graph title from a viral meme post", () => {
    const html =
      '<meta property="og:title" content="When you finally understand Web3 social media 😂">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("When you finally understand Web3 social media 😂");
  });

  it("should extract Twitter title from a trending hashtag post", () => {
    const html =
      '<meta name="twitter:title" content="Breaking: #LensSocial hits 1M users! 🚀">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("Breaking: #LensSocial hits 1M users! 🚀");
  });

  it("should prioritize Open Graph title over Twitter title for shared blog post", () => {
    const html = `
      <meta property="og:title" content="How I Built a Decentralized Social App in 2024">
      <meta name="twitter:title" content="My Journey Building on Lens Protocol">
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("How I Built a Decentralized Social App in 2024");
  });

  it("should return null when user shares a page without social media metadata", () => {
    const html = '<meta name="description" content="Random page content">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBeNull();
  });

  it("should return null when shared link has empty social media titles", () => {
    const html = `
      <meta property="og:title" content="">
      <meta name="twitter:title" content="">
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBeNull();
  });

  it("should handle post titles with only whitespace", () => {
    const html = '<meta property="og:title" content="   ">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe("   ");
  });

  it("should handle post titles with special characters and mentions", () => {
    const html =
      '<meta property="og:title" content="Check out @vitalik.eth&apos;s latest post about &quot;The Future of DeFi&quot;">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe(
      'Check out @vitalik.eth\'s latest post about "The Future of DeFi"'
    );
  });

  it("should handle very long thread titles", () => {
    const longTitle =
      "🧵 THREAD: Everything you need to know about decentralized social media protocols and why they matter for the future of online communities and content creation. Let me break it down for you in simple terms that anyone can understand. This is going to be a long one so grab some coffee and let's dive deep into the world of Web3 social platforms and their revolutionary potential to reshape how we connect, share, and monetize our digital presence in the creator economy. From Lens Protocol to Farcaster, we'll explore the key players and what makes them special.";
    const html = `<meta property="og:title" content="${longTitle}">`;
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe(longTitle);
  });

  it("should handle multi-line post titles with formatting", () => {
    const html =
      '<meta property="og:title" content="GM  fam!\n\nJust dropped  my latest  NFT collection 🎨">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe(
      "GM  fam!\n\nJust dropped  my latest  NFT collection 🎨"
    );
  });

  it("should handle international post titles with emojis", () => {
    const html =
      '<meta property="og:title" content="🌍 Global Web3 Community Meetup - 我们一起建设未来 🚀">';
    const { document } = parseHTML(html);
    const result = getTitle(document);
    expect(result).toBe(
      "🌍 Global Web3 Community Meetup - 我们一起建设未来 🚀"
    );
  });
});
