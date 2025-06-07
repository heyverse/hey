import { describe, expect, it } from "vitest";
import {
  CACHE_AGE_1_DAY,
  HEY_USER_AGENT,
  SITEMAP_BATCH_SIZE
} from "./constants";

describe("constants", () => {
  it("have expected values", () => {
    expect(HEY_USER_AGENT).toBe("HeyBot (like TwitterBot)");
    expect(SITEMAP_BATCH_SIZE).toBe(25000);
    expect(CACHE_AGE_1_DAY).toBe("public, s-maxage=86400, max-age=86400");
  });
});
