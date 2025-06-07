import { describe, expect, it } from "vitest";
import { LENS_MAINNET_RPCS, LENS_TESTNET_RPCS } from "./rpcs";

describe("rpcs", () => {
  it("contains expected mainnet RPCs", () => {
    expect(LENS_MAINNET_RPCS).toEqual([
      "https://rpc.lens.xyz",
      "https://api.lens.matterhosted.dev",
      "https://lens-mainnet.g.alchemy.com/v2/N_HuqeYE3mr_enxw-BGFI2rOm1U7bhGy"
    ]);
  });

  it("contains expected testnet RPCs", () => {
    expect(LENS_TESTNET_RPCS).toEqual([
      "https://rpc.testnet.lens.dev",
      "https://lens-sepolia.g.alchemy.com/v2/N_HuqeYE3mr_enxw-BGFI2rOm1U7bhGy"
    ]);
  });
});
