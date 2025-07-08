import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";
import getDescription from "./getDescription";

describe("getDescription", () => {
  it("should extract Open Graph description from a shared NFT collection", () => {
    const html =
      '<meta property="og:description" content="Check out this amazing Web3 art collection featuring 10,000 unique avatars living on the blockchain! 🎨✨">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      "Check out this amazing Web3 art collection featuring 10,000 unique avatars living on the blockchain! 🎨✨"
    );
  });

  it("should extract Twitter description from a community announcement", () => {
    const html =
      '<meta name="twitter:description" content="🚀 Big news! Our decentralized social platform just launched Spaces - join live conversations with your favorite creators and frens!">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      "🚀 Big news! Our decentralized social platform just launched Spaces - join live conversations with your favorite creators and frens!"
    );
  });

  it("should prioritize Open Graph description over Twitter description for blog post", () => {
    const html = `
      <meta property="og:description" content="A comprehensive guide to understanding DeFi protocols, yield farming, and how to maximize your crypto earnings in 2024.">
      <meta name="twitter:description" content="Learn about DeFi and yield farming">
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      "A comprehensive guide to understanding DeFi protocols, yield farming, and how to maximize your crypto earnings in 2024."
    );
  });

  it("should return null when shared link has no social media descriptions", () => {
    const html = '<meta name="title" content="Random website">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBeNull();
  });

  it("should return null when shared post has empty descriptions", () => {
    const html = `
      <meta property="og:description" content="">
      <meta name="twitter:description" content="">
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBeNull();
  });

  it("should handle post descriptions with only whitespace", () => {
    const html = '<meta property="og:description" content="   ">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe("   ");
  });

  it("should handle post descriptions with mentions and special characters", () => {
    const html =
      '<meta property="og:description" content="Just minted my first NFT! 🎉 Shoutout to @opensea &amp; @ethereum for making this possible. &quot;The future is here&quot; 🚀">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      'Just minted my first NFT! 🎉 Shoutout to @opensea & @ethereum for making this possible. "The future is here" 🚀'
    );
  });

  it("should handle very long thread descriptions", () => {
    const longDescription =
      "🧵 MEGA THREAD: Let me explain why decentralized social media is the future and how it's going to change everything we know about online communities. From data ownership to censorship resistance, from creator monetization to user empowerment, there are so many reasons why Web3 social platforms are revolutionary. In this thread, I'll break down the key differences between Web2 and Web3 social media, the main protocols you should know about, and why you should care about this shift. Whether you're a developer, content creator, or just someone who spends time online, this affects you. Let's dive deep into the world of decentralized social networking and explore what makes it so special. We'll cover everything from blockchain basics to advanced concepts like composability and interoperability. By the end of this thread, you'll understand why so many people are excited about the future of social media and how you can be part of this revolution.";
    const html = `<meta property="og:description" content="${longDescription}">`;
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(longDescription);
  });

  it("should handle multi-line post descriptions with formatting", () => {
    const html =
      '<meta property="og:description" content="GM  builders! 🌅\n\nJust shipped  a new  feature for our  social dApp.\n\nCan\'t wait to see what you all build with it! 🛠️">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      "GM  builders! 🌅\n\nJust shipped  a new  feature for our  social dApp.\n\nCan't wait to see what you all build with it! 🛠️"
    );
  });

  it("should handle international post descriptions with emojis", () => {
    const html =
      '<meta property="og:description" content="🌏 Building the future of social media together! 一起构建社交媒体的未来！Web3コミュニティへようこそ 🚀">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      "🌏 Building the future of social media together! 一起构建社交媒体的未来！Web3コミュニティへようこそ 🚀"
    );
  });

  it("should handle descriptions with HTML entities from user-generated content", () => {
    const html =
      '<meta property="og:description" content="Posted some code on my profile: &lt;script&gt; console.log(&quot;Hello Web3!&quot;) &lt;/script&gt; Check it out!">';
    const { document } = parseHTML(html);
    const result = getDescription(document);
    expect(result).toBe(
      'Posted some code on my profile: <script> console.log("Hello Web3!") </script> Check it out!'
    );
  });
});
