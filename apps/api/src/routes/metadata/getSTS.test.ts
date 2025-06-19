import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import { describe, expect, it, vi } from "vitest";
import getSTS from "./getSTS";

vi.mock("@aws-sdk/client-sts", () => {
  return {
    STSClient: vi.fn().mockImplementation(() => ({
      send: vi.fn().mockResolvedValue({
        Credentials: {
          AccessKeyId: "AK",
          SecretAccessKey: "SK",
          SessionToken: "ST"
        }
      })
    })),
    AssumeRoleCommand: vi.fn()
  };
});

describe("metadata getSTS route", () => {
  it("returns temporary credentials", async () => {
    const ctx = {
      json: vi.fn((body: unknown) => body)
    } as unknown as Context;

    const result = await getSTS(ctx);

    expect(ctx.json).toHaveBeenCalledWith({
      status: Status.Success,
      data: {
        accessKeyId: "AK",
        secretAccessKey: "SK",
        sessionToken: "ST"
      }
    });
    expect(result).toEqual({
      status: Status.Success,
      data: { accessKeyId: "AK", secretAccessKey: "SK", sessionToken: "ST" }
    });
  });
});
