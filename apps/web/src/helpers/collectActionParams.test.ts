import { describe, expect, it } from "vitest";
import collectActionParams from "./collectActionParams";

describe("collectActionParams", () => {
  it("maps collect action fields", () => {
    const input = { payToCollect: true, collectLimit: 3, endsAt: "now" } as any;
    expect(collectActionParams(input)).toEqual({
      simpleCollect: { payToCollect: true, collectLimit: 3, endsAt: "now" }
    });
  });
});
