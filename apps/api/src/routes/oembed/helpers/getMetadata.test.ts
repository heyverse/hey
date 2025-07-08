import { beforeEach, describe, expect, it, vi } from "vitest";
import getMetadata from "./getMetadata";

// Mock fetch
global.fetch = vi.fn();

describe("getMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract title and description from shared Web3 blog post", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="How to Build Your First NFT Marketplace on Ethereum">
          <meta property="og:description" content="A complete guide to creating decentralized marketplaces with React, Solidity, and IPFS. Learn about smart contracts, Web3 integration, and user experience design.">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata(
      "https://web3builder.dev/nft-marketplace-guide"
    );

    expect(result).toEqual({
      description:
        "A complete guide to creating decentralized marketplaces with React, Solidity, and IPFS. Learn about smart contracts, Web3 integration, and user experience design.",
      title: "How to Build Your First NFT Marketplace on Ethereum",
      url: "https://web3builder.dev/nft-marketplace-guide"
    });
  });

  it("should handle missing title and description from basic user profile", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta name="keywords" content="blockchain,crypto,nft">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://lens.xyz/u/vitalik");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://lens.xyz/u/vitalik"
    });
  });

  it("should handle network errors when fetching shared social media links", async () => {
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    const result = await getMetadata(
      "https://opensea.io/collection/cryptopunks"
    );

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://opensea.io/collection/cryptopunks"
    });
  });

  it("should handle HTTP errors when user shares dead links", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404
    });

    const result = await getMetadata("https://deadnftproject.com/mint");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://deadnftproject.com/mint"
    });
  });

  it("should handle malformed HTML from poorly built DeFi sites", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="🚀 New DeFi Protocol - Earn 1000% APY!"
          <meta property="og:description"
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://definitely-not-a-scam-defi.com");

    expect(result).toEqual({
      description: null,
      title: "🚀 New DeFi Protocol - Earn 1000% APY!",
      url: "https://definitely-not-a-scam-defi.com"
    });
  });

  it("should handle empty HTML from minimal dApp landing pages", async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("")
    });

    const result = await getMetadata("https://minimal-dapp.vercel.app");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://minimal-dapp.vercel.app"
    });
  });

  it("should use correct User-Agent header when fetching NFT marketplace links", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Rare Pepe NFT Collection #1337">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    await getMetadata("https://rarible.com/token/0x123...456");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://rarible.com/token/0x123...456",
      {
        headers: {
          "User-Agent": "HeyBot (like TwitterBot)"
        }
      }
    );
  });

  it("should handle Twitter meta tags when Open Graph is not available from crypto news sites", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta name="twitter:title" content="Bitcoin Hits All-Time High as Institutions Adopt Crypto">
          <meta name="twitter:description" content="Major corporations and financial institutions are embracing cryptocurrency as Bitcoin reaches new record prices. Here's what this means for the future of finance.">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata("https://cryptonews.com/bitcoin-ath-2024");

    expect(result).toEqual({
      description:
        "Major corporations and financial institutions are embracing cryptocurrency as Bitcoin reaches new record prices. Here's what this means for the future of finance.",
      title: "Bitcoin Hits All-Time High as Institutions Adopt Crypto",
      url: "https://cryptonews.com/bitcoin-ath-2024"
    });
  });

  it("should handle mixed meta tags from DAO governance proposals", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Proposal #42: Upgrade Smart Contract to v2.0">
          <meta name="twitter:description" content="Vote on upgrading our core smart contract to add new features and improve gas efficiency. Voting ends in 72 hours.">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata(
      "https://snapshot.org/#/awesome-dao.eth/proposal/0x123"
    );

    expect(result).toEqual({
      description:
        "Vote on upgrading our core smart contract to add new features and improve gas efficiency. Voting ends in 72 hours.",
      title: "Proposal #42: Upgrade Smart Contract to v2.0",
      url: "https://snapshot.org/#/awesome-dao.eth/proposal/0x123"
    });
  });

  it("should handle fetch timeout from slow IPFS gateways", async () => {
    (global.fetch as any).mockImplementation(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 100)
        )
    );

    const result = await getMetadata("https://ipfs.io/ipfs/QmSlowHash123");

    expect(result).toEqual({
      description: null,
      title: null,
      url: "https://ipfs.io/ipfs/QmSlowHash123"
    });
  });

  it("should handle special characters in URL from DeFi trading links", async () => {
    const mockHtml = `
      <html>
        <head>
          <meta property="og:title" content="Swap ETH to USDC - Best Rates on DeFi">
        </head>
      </html>
    `;

    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    });

    const result = await getMetadata(
      "https://uniswap.org/swap?inputCurrency=ETH&outputCurrency=0xA0b86a33E6414506fb26f3e9aE8c6B8F6B3A8E7"
    );

    expect(result).toEqual({
      description: null,
      title: "Swap ETH to USDC - Best Rates on DeFi",
      url: "https://uniswap.org/swap?inputCurrency=ETH&outputCurrency=0xA0b86a33E6414506fb26f3e9aE8c6B8F6B3A8E7"
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://uniswap.org/swap?inputCurrency=ETH&outputCurrency=0xA0b86a33E6414506fb26f3e9aE8c6B8F6B3A8E7",
      {
        headers: {
          "User-Agent": "HeyBot (like TwitterBot)"
        }
      }
    );
  });
});
