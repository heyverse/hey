import { describe, expect, it } from "vitest";
import getMentions from "./getMentions";

describe("getMentions", () => {
  it("returns empty array when post has no mentions", () => {
    expect(getMentions("")).toEqual([]);
  });

  it("extracts a single mention from a GM post", () => {
    const result = getMentions(
      "GM @lens/vitalik! Love your latest article about Ethereum 2.0 🚀"
    );
    expect(result).toEqual([
      {
        account: "",
        namespace: "",
        replace: { from: "vitalik", to: "vitalik" }
      }
    ]);
  });

  it("extracts multiple mentions from a community shoutout", () => {
    const result = getMentions(
      "Huge props to @lens/aave and @lens/Uniswap for building the DeFi infrastructure we all depend on!"
    );
    expect(result).toEqual([
      { account: "", namespace: "", replace: { from: "aave", to: "aave" } },
      {
        account: "",
        namespace: "",
        replace: { from: "uniswap", to: "uniswap" }
      }
    ]);
  });

  it("ignores @ symbols in email addresses within posts", () => {
    expect(
      getMentions("DM me at hello@lens/web3builder for collaborations")
    ).toEqual([]);
  });
});
