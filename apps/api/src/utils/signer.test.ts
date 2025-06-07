import { privateKeyToAccount } from "viem/accounts";
import { beforeAll, describe, expect, it } from "vitest";

let signer: typeof import("./signer").default;

beforeAll(async () => {
  process.env.PRIVATE_KEY = `0x${"1".repeat(64)}`;
  signer = (await import("./signer")).default;
});

describe("signer", () => {
  it("creates wallet client with given key", () => {
    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`
    );
    expect(signer.account.address).toBe(account.address);
  });
});
