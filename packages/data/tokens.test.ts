import { afterEach, describe, expect, it, vi } from "vitest";

const reset = () => {
  vi.resetModules();
  process.env.NEXT_PUBLIC_LENS_NETWORK = undefined as any;
};

afterEach(() => {
  reset();
});

describe("tokens", () => {
  it("returns mainnet tokens by default", async () => {
    const { tokens } = await import("./tokens");
    expect(tokens.map((t) => t.contractAddress)).toEqual([
      "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F",
      "0xB0588f9A9cADe7CD5f194a5fe77AcD6A58250f82"
    ]);
  });

  it("returns testnet tokens when LENS_NETWORK=testnet", async () => {
    process.env.NEXT_PUBLIC_LENS_NETWORK = "testnet";
    const { tokens } = await import("./tokens");
    expect(tokens.map((t) => t.contractAddress)).toEqual([
      "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8"
    ]);
  });
});
