import { MetadataLicenseType } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getAssetLicense from "./getAssetLicense";

describe("getAssetLicense", () => {
  it("returns null when license id is missing", () => {
    expect(getAssetLicense(undefined)).toBeNull();
  });

  it("handles CC0 license", () => {
    const result = getAssetLicense(MetadataLicenseType.Cco);
    expect(result).toEqual({
      helper:
        "Anyone can use, modify and distribute the work without any restrictions or need for attribution. CC0",
      label: "CC0 - no restrictions"
    });
  });

  it("handles commercial rights license", () => {
    const result = getAssetLicense(MetadataLicenseType.TbnlCdNplLegal);
    expect(result).toEqual({
      helper:
        "You allow the collector to use the content for any purpose, except creating or sharing any derivative works, such as remixes.",
      label: "Commercial rights for the collector"
    });
  });

  it("handles personal rights license", () => {
    const result = getAssetLicense(MetadataLicenseType.TbnlNcDNplLegal);
    expect(result).toEqual({
      helper:
        "You allow the collector to use the content for any personal, non-commercial purpose, except creating or sharing any derivative works, such as remixes.",
      label: "Personal rights for the collector"
    });
  });

  it("returns null for unsupported license", () => {
    expect(getAssetLicense(MetadataLicenseType.CcBy)).toBeNull();
  });
});
