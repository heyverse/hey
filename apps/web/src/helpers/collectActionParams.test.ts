import type { CollectActionType } from "@hey/types/hey";
import { describe, expect, it } from "vitest";
import collectActionParams from "./collectActionParams";

describe("collectActionParams", () => {
  it("maps collect action fields to simple collect config", () => {
    const collectAction: CollectActionType = {
      collectLimit: 10,
      endsAt: "2024-01-01T00:00:00.000Z",
      followerOnly: true,
      payToCollect: { recipients: [] } as any
    };

    const result = collectActionParams(collectAction);

    expect(result).toEqual({
      simpleCollect: {
        collectLimit: 10,
        endsAt: "2024-01-01T00:00:00.000Z",
        payToCollect: { recipients: [] }
      }
    });
  });

  it("handles missing optional fields", () => {
    const collectAction: CollectActionType = {};

    const result = collectActionParams(collectAction);

    expect(result).toEqual({
      simpleCollect: {
        collectLimit: undefined,
        endsAt: undefined,
        payToCollect: undefined
      }
    });
  });
});
