import { LENS_MEDIA_SNAPSHOT_URL } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import imageKit from "./imageKit";

describe("imageKit", () => {
  it("returns empty string for empty url", () => {
    expect(imageKit("")).toBe("");
  });

  it("passes through non snapshot url", () => {
    expect(imageKit("https://example.com/a.png")).toBe(
      "https://example.com/a.png"
    );
  });

  it("applies transform for snapshot url", () => {
    const url = `${LENS_MEDIA_SNAPSHOT_URL}/path/file.jpg`;
    expect(imageKit(url, "tr:w-100")).toBe(
      `${LENS_MEDIA_SNAPSHOT_URL}/tr:w-100/file.jpg`
    );
  });

  it("preserves query string in snapshot url", () => {
    const url = `${LENS_MEDIA_SNAPSHOT_URL}/path/file.jpg?ver=1`;
    expect(imageKit(url, "tr:w-100")).toBe(
      `${LENS_MEDIA_SNAPSHOT_URL}/tr:w-100/file.jpg?ver=1`
    );
  });

  it("handles trailing slash in snapshot url", () => {
    const url = `${LENS_MEDIA_SNAPSHOT_URL}/path/file.jpg/`;
    expect(imageKit(url, "tr:w-100")).toBe(
      `${LENS_MEDIA_SNAPSHOT_URL}/tr:w-100/`
    );
  });
});
