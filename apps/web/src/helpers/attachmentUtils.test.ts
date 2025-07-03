import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hey/helpers/generateUUID", () => ({ default: vi.fn() }));
vi.mock("./compressImage", () => ({
  default: vi.fn(async (file: File) => file)
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

import generateUUID from "@hey/helpers/generateUUID";
import { toast } from "sonner";
import {
  compressFiles,
  createPreviewAttachments,
  validateFileSize
} from "./attachmentUtils";
import compressImage from "./compressImage";

Object.defineProperty(global.URL, "createObjectURL", {
  value: vi.fn(),
  writable: true
});

describe("attachmentUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateFileSize", () => {
    it("returns false and shows toast when image exceeds limit", () => {
      const file = new File(["a"], "img.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 50000001 });

      const result = validateFileSize(file);

      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        "Image size should be less than 50MB"
      );
    });

    it("returns true when file size is within limit", () => {
      const file = new File(["a"], "img.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 10 });

      const result = validateFileSize(file);

      expect(result).toBe(true);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe("compressFiles", () => {
    it("compresses image files", async () => {
      const file = new File(["a"], "img.png", { type: "image/png" });
      const compressed = new File(["b"], "img.png", { type: "image/png" });
      vi.mocked(compressImage).mockResolvedValueOnce(compressed);

      const [result] = await compressFiles([file]);

      expect(compressImage).toHaveBeenCalledWith(file, {
        maxSizeMB: 9,
        maxWidthOrHeight: 6000
      });
      expect(result).toBe(compressed);
    });

    it("skips compression for gifs", async () => {
      const file = new File(["a"], "anim.gif", { type: "image/gif" });

      const [result] = await compressFiles([file]);

      expect(compressImage).not.toHaveBeenCalled();
      expect(result).toBe(file);
    });
  });

  describe("createPreviewAttachments", () => {
    it("creates preview attachments with ids and urls", () => {
      vi.mocked(generateUUID)
        .mockReturnValueOnce("id1")
        .mockReturnValueOnce("id2");
      const urlSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValueOnce("url1")
        .mockReturnValueOnce("url2");
      const image = new File(["a"], "img.png", { type: "image/png" });
      const video = new File(["a"], "vid.mp4", { type: "video/mp4" });

      const result = createPreviewAttachments([image, video]);

      expect(result).toEqual([
        {
          file: image,
          id: "id1",
          mimeType: "image/png",
          previewUri: "url1",
          type: "Image"
        },
        {
          file: video,
          id: "id2",
          mimeType: "video/mp4",
          previewUri: "url2",
          type: "Video"
        }
      ]);

      urlSpy.mockRestore();
    });
  });
});
