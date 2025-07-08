import { describe, expect, it } from "vitest";
import splitNumber from "./splitNumber";

describe("splitNumber", () => {
  it("evenly distributes engagement metrics across multiple feeds", () => {
    expect(splitNumber(5, 2)).toEqual([3, 2]);
  });
});
