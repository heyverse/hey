import { describe, expect, it, vi } from "vitest";

// biome-ignore lint/style/noVar: mock variable initialized before imports
var updateMock: ReturnType<typeof vi.fn>;

vi.mock("@guildxyz/sdk", () => {
  updateMock = vi.fn(async () => ({ updatedAt: "now" }));
  return {
    createSigner: { custom: vi.fn((fn) => fn) },
    createGuildClient: vi.fn(() => ({
      guild: { role: { requirement: { update: updateMock } } }
    }))
  };
});

vi.mock("./signer", () => ({
  default: { signMessage: vi.fn(), account: { address: "0xabc" } }
}));

import syncAddressesToGuild from "./syncAddressesToGuild";

describe("syncAddressesToGuild", () => {
  it("updates addresses", async () => {
    const result = await syncAddressesToGuild({
      addresses: ["0x1"],
      requirementId: 1,
      roleId: 2
    });

    expect(updateMock).toHaveBeenCalled();
    expect(result).toEqual({ success: true, total: 1, updatedAt: "now" });
  });
});
