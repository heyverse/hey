import { describe, expect, it } from "vitest";
import splitNumber from "./splitNumber";

describe("splitNumber", () => {
  it("splits number evenly", () => {
    expect(splitNumber(10, 3)).toEqual([4, 3, 3]);
  });

  it("handles default arguments", () => {
    expect(splitNumber()).toEqual([1]);
  });
});
