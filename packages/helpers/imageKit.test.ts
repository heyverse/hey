import { LENS_MEDIA_SNAPSHOT_URL } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import imageKit from "./imageKit";

describe("imageKit", () => {
  it("returns an empty string for empty url", () => {
    const result = imageKit("");
    expect(result).toBe("");
  });

  it("returns the original url when not a lens snapshot", () => {
    const url = "https://example.com/photo.jpg";
    const result = imageKit(url, "tr:w-100");
    expect(result).toBe(url);
  });

  it("applies transform when url is a lens snapshot", () => {
    const original = `${LENS_MEDIA_SNAPSHOT_URL}/photo.jpg`;
    const result = imageKit(original, "tr:w-200");
    expect(result).toBe(`${LENS_MEDIA_SNAPSHOT_URL}/tr:w-200/photo.jpg`);
  });

  it("returns the same url if no transform is provided", () => {
    const original = `${LENS_MEDIA_SNAPSHOT_URL}/avatar.png`;
    const result = imageKit(original);
    expect(result).toBe(original);
  });
});
