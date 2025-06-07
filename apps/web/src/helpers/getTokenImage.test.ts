import { describe, expect, it } from "vitest";
import getTokenImage from "./getTokenImage";

describe("getTokenImage", () => {
  it("defaults to gho icon", () => {
    expect(getTokenImage()).toContain("gho.svg");
  });

  it("uses lowercase symbol", () => {
    expect(getTokenImage("USDC")).toContain("usdc.svg");
  });
});
