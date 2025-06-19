import { PERMISSIONS } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import signer from "src/utils/signer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import removeExpiredSubscribers from "./index";

vi.mock("src/utils/lensPg", () => ({ default: { query: vi.fn() } }));
vi.mock("src/utils/signer", () => ({ default: { writeContract: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("removeExpiredSubscribers", () => {
  it("queries db and calls contract", async () => {
    const buf = Buffer.from("4".repeat(40), "hex");
    (lensPg.query as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { account: buf }
    ]);
    (
      signer.writeContract as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue("hash");
    const ctx = { json: vi.fn((b: unknown) => b) } as unknown as Context;

    const result = await removeExpiredSubscribers(ctx);

    expect(lensPg.query).toHaveBeenCalled();
    expect(signer.writeContract).toHaveBeenCalledWith({
      abi: expect.anything(),
      address: PERMISSIONS.SUBSCRIPTION,
      functionName: "removeMembers",
      args: [
        [
          {
            account: `0x${buf.toString("hex")}`,
            customParams: [],
            ruleProcessingParams: []
          }
        ],
        []
      ]
    });
    expect(result).toEqual({
      status: Status.Success,
      addresses: [`0x${buf.toString("hex")}`],
      hash: "hash"
    });
  });

  it("returns success when no accounts are expired", async () => {
    (lensPg.query as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const ctx = { json: vi.fn((b: unknown) => b) } as unknown as Context;

    const result = await removeExpiredSubscribers(ctx);

    expect(result).toEqual({
      status: Status.Success,
      message: "No expired subscribers"
    });
  });
});
