import imageCompression from "browser-image-compression";
import { describe, expect, it, vi } from "vitest";
import compressImage from "./compressImage";

vi.mock("browser-image-compression");

describe("compressImage", () => {
  it("merges provided options with defaults", async () => {
    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    const options = { maxSizeMB: 1 };
    const compressed = new File(["compressed"], "photo.jpg", {
      type: "image/jpeg"
    });

    vi.mocked(imageCompression).mockResolvedValueOnce(compressed);

    const result = await compressImage(file, options);

    expect(imageCompression).toHaveBeenCalledWith(file, {
      exifOrientation: 1,
      useWebWorker: true,
      ...options
    });
    expect(result).toBe(compressed);
  });

  it("returns the compressed file from imageCompression", async () => {
    const file = new File(["f"], "avatar.png", { type: "image/png" });
    const compressed = new File(["c"], "avatar.png", { type: "image/png" });

    vi.mocked(imageCompression).mockResolvedValueOnce(compressed);

    const result = await compressImage(file, {});

    expect(result).toBe(compressed);
  });
});
