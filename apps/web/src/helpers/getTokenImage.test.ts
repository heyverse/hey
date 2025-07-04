import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import getTokenImage from "./getTokenImage";

describe("getTokenImage", () => {
  it("returns default image when symbol is missing", () => {
    expect(getTokenImage()).toBe(`${STATIC_IMAGES_URL}/tokens/gho.svg`);
    expect(getTokenImage(undefined)).toBe(
      `${STATIC_IMAGES_URL}/tokens/gho.svg`
    );
    expect(getTokenImage("")).toBe(`${STATIC_IMAGES_URL}/tokens/gho.svg`);
  });

  it("lowercases the symbol and returns the correct path", () => {
    expect(getTokenImage("USDC")).toBe(`${STATIC_IMAGES_URL}/tokens/usdc.svg`);
    expect(getTokenImage("eth")).toBe(`${STATIC_IMAGES_URL}/tokens/eth.svg`);
    expect(getTokenImage("WmAtIc")).toBe(
      `${STATIC_IMAGES_URL}/tokens/wmatic.svg`
    );
  });
});
