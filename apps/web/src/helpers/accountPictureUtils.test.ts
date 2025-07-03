import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./compressImage", () => ({
  default: vi.fn()
}));

vi.mock("./uploadToIPFS", () => ({
  uploadFileToIPFS: vi.fn()
}));

import uploadCroppedImage, { readFile } from "./accountPictureUtils";
import compressImage from "./compressImage";
import { uploadFileToIPFS } from "./uploadToIPFS";

const mockedCompressImage = compressImage as unknown as ReturnType<
  typeof vi.fn
>;
const mockedUploadFileToIPFS = uploadFileToIPFS as unknown as ReturnType<
  typeof vi.fn
>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("readFile", () => {
  it("returns a data URL for the provided blob", async () => {
    const blob = new Blob(["hello"], { type: "image/png" });
    const url = await readFile(blob);
    const expected = `data:image/png;base64,${Buffer.from("hello").toString("base64")}`;
    expect(url).toBe(expected);
  });
});

describe("uploadCroppedImage", () => {
  it("uploads the cropped image and returns the uri", async () => {
    const canvas = document.createElement("canvas");
    const blob = new Blob(["img"], { type: "image/png" });
    Object.assign(canvas, {
      toBlob: (cb: (b: Blob | null) => void) => cb(blob)
    });

    const compressed = new File([blob], "compressed.png", {
      type: "image/png"
    });
    mockedCompressImage.mockResolvedValue(compressed);
    mockedUploadFileToIPFS.mockResolvedValue({
      mimeType: "image/png",
      uri: "ipfs://image"
    });

    const url = await uploadCroppedImage(canvas);
    expect(url).toBe("ipfs://image");
    expect(mockedCompressImage).toHaveBeenCalledWith(expect.any(File), {
      maxSizeMB: 6,
      maxWidthOrHeight: 3000
    });
    expect(mockedUploadFileToIPFS).toHaveBeenCalledWith(compressed);
  });

  it("throws when uploadFileToIPFS returns an empty uri", async () => {
    const canvas = document.createElement("canvas");
    const blob = new Blob(["img"], { type: "image/png" });
    Object.assign(canvas, {
      toBlob: (cb: (b: Blob | null) => void) => cb(blob)
    });

    const compressed = new File([blob], "compressed.png", {
      type: "image/png"
    });
    mockedCompressImage.mockResolvedValue(compressed);
    mockedUploadFileToIPFS.mockResolvedValue({
      mimeType: "image/png",
      uri: ""
    });

    await expect(uploadCroppedImage(canvas)).rejects.toThrow(
      "uploadFileToIPFS failed"
    );
  });
});
