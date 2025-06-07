import { describe, expect, it } from "vitest";
import defaultMetadata from "./defaultMetadata";

describe("defaultMetadata", () => {
  it("contains Hey title", () => {
    expect(String(defaultMetadata)).toContain("<title>Hey</title>");
  });
});
