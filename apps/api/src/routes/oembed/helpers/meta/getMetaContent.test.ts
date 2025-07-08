import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import getMetaContent from "./getMetaContent";

describe("getMetaContent", () => {
  it("should extract profile description meta content", () => {
    const html =
      '<meta name="description" content="Crypto enthusiast, NFT collector, and Web3 builder sharing daily insights about the decentralized future 🌐">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe(
      "Crypto enthusiast, NFT collector, and Web3 builder sharing daily insights about the decentralized future 🌐"
    );
  });

  it("should extract social media post title from property attribute", () => {
    const html =
      '<meta property="og:title" content="Just launched my first dApp! 🚀 Check out this decentralized social network">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "og:title");
    expect(result).toBe(
      "Just launched my first dApp! 🚀 Check out this decentralized social network"
    );
  });

  it("should return null when user profile has no meta description", () => {
    const html = '<meta name="keywords" content="blockchain,web3,defi">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBeNull();
  });

  it("should return null when shared link has incomplete meta tags", () => {
    const html = '<meta name="description">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBeNull();
  });

  it("should return empty string when user has empty bio", () => {
    const html = '<meta name="description" content="">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("");
  });

  it("should handle case-sensitive attribute matching for social media cards", () => {
    const html =
      '<meta NAME="description" content="Building the future of social media">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBeNull();
  });

  it("should prefer name attribute over property for profile descriptions", () => {
    const html = `
      <meta name="description" content="DeFi researcher | Building on Ethereum | Follow for alpha 📈">
      <meta property="description" content="Generic description">
    `;
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe(
      "DeFi researcher | Building on Ethereum | Follow for alpha 📈"
    );
  });

  it("should handle multiple meta tags and return first social media description", () => {
    const html = `
      <meta name="description" content="GM! Just dropped my new NFT collection 🎨">
      <meta name="description" content="Second description">
    `;
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("GM! Just dropped my new NFT collection 🎨");
  });

  it("should handle special characters in social media content", () => {
    const html =
      '<meta name="description" content="Talking about @ethereum &amp; @uniswap - the future of &quot;DeFi&quot; is here!">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe(
      'Talking about @ethereum & @uniswap - the future of "DeFi" is here!'
    );
  });

  it("should return whitespace-only content from minimal social posts", () => {
    const html = '<meta name="description" content="   ">';
    const { document } = parseHTML(html);
    const result = getMetaContent(document, "description");
    expect(result).toBe("   ");
  });
});
