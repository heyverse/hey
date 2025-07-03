import {
  type MetadataAttributeFragment,
  MetadataAttributeType
} from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getAccountAttribute from "./getAccountAttribute";

describe("getAccountAttribute", () => {
  it("returns the attribute value when present", () => {
    const attributes: MetadataAttributeFragment[] = [
      { key: "location", type: MetadataAttributeType.String, value: "Berlin" },
      {
        key: "website",
        type: MetadataAttributeType.String,
        value: "https://example.com"
      }
    ];
    const result = getAccountAttribute("website", attributes);
    expect(result).toBe("https://example.com");
  });

  it("returns an empty string when the attribute is missing", () => {
    const attributes: MetadataAttributeFragment[] = [
      { key: "location", type: MetadataAttributeType.String, value: "Berlin" }
    ];
    const result = getAccountAttribute("x", attributes);
    expect(result).toBe("");
  });

  it("returns an empty string when attributes are undefined", () => {
    const result = getAccountAttribute("website", undefined);
    expect(result).toBe("");
  });

  it("handles the 'x' attribute", () => {
    const attributes: MetadataAttributeFragment[] = [
      {
        key: "x",
        type: MetadataAttributeType.String,
        value: "https://x.com/hey"
      }
    ];
    const result = getAccountAttribute("x", attributes);
    expect(result).toBe("https://x.com/hey");
  });
});
