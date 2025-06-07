import { afterEach, describe, expect, it, vi } from "vitest";

const load = async (network?: string) => {
  vi.resetModules();
  vi.doMock("../constants", () => ({ LENS_NETWORK: network ?? "mainnet" }));
  const mod = await import("./getEnvConfig");
  vi.unmock("../constants");
  return mod.default;
};

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("getEnvConfig", () => {
  it("returns testnet endpoints when LENS_NETWORK is testnet", async () => {
    const getEnvConfig = await load("testnet");
    const config = getEnvConfig();
    expect(config.lensApiEndpoint).toBe("https://api.testnet.lens.xyz/graphql");
    expect(config.defaultCollectToken).toBe(
      "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8"
    );
    expect(config.appAddress).toBe(
      "0x688419B0299f3Ed8E80eBCa71ad05Ac23d20822b"
    );
  });

  it("returns staging endpoints when LENS_NETWORK is staging", async () => {
    const getEnvConfig = await load("staging");
    const config = getEnvConfig();
    expect(config.lensApiEndpoint).toBe("https://api.staging.lens.xyz/graphql");
    expect(config.defaultCollectToken).toBe(
      "0xeee5a340Cdc9c179Db25dea45AcfD5FE8d4d3eB8"
    );
    expect(config.appAddress).toBe(
      "0x688419B0299f3Ed8E80eBCa71ad05Ac23d20822b"
    );
  });

  it("returns mainnet endpoints by default", async () => {
    const getEnvConfig = await load();
    const config = getEnvConfig();
    expect(config.lensApiEndpoint).toBe("https://api.lens.xyz/graphql");
    expect(config.defaultCollectToken).toBe(
      "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F"
    );
    expect(config.appAddress).toBe(
      "0x1eFA8F82d9E919F6b6A5f1701131c9Cb1a943BAA"
    );
  });
});
