import { beforeEach, describe, expect, it, vi } from "vitest";

var headObject: ReturnType<typeof vi.fn>;
var done: ReturnType<typeof vi.fn>;
var sts: ReturnType<typeof vi.fn>;
var uploadFile: ReturnType<typeof vi.fn>;
var uuid: ReturnType<typeof vi.fn>;
var immutableMock: ReturnType<typeof vi.fn>;

vi.mock("@aws-sdk/client-s3", () => {
  headObject = vi.fn();
  return { S3: vi.fn(() => ({ headObject })) };
});
vi.mock("@aws-sdk/lib-storage", () => {
  done = vi.fn();
  return { Upload: vi.fn(() => ({ done })) };
});
vi.mock("./fetcher", () => {
  sts = vi.fn();
  return { hono: { metadata: { sts } } };
});
vi.mock("./storageClient", () => {
  uploadFile = vi.fn();
  return { storageClient: { uploadFile } };
});
vi.mock("@hey/helpers/generateUUID", () => {
  uuid = vi.fn();
  return { default: uuid };
});
vi.mock("@lens-chain/storage-client", () => {
  immutableMock = vi.fn();
  return { immutable: immutableMock };
});

import uploadToIPFS, * as uploadModule from "./uploadToIPFS";

const { uploadFileToIPFS } = uploadModule;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadToIPFS", () => {
  it("uploads small files using the storage client", async () => {
    uploadFile.mockResolvedValueOnce({ uri: "ipfs://small" });
    immutableMock.mockReturnValue("acl");

    const file = new File(["x"], "img.png", { type: "image/png" });

    const [result] = await uploadToIPFS([file]);

    expect(uploadFile).toHaveBeenCalledWith(file, { acl: "acl" });
    expect(result).toEqual({ mimeType: "image/png", uri: "ipfs://small" });
    expect(done).not.toHaveBeenCalled();
  });

  it("uploads large files using S3", async () => {
    sts.mockResolvedValueOnce({
      accessKeyId: "a",
      secretAccessKey: "b",
      sessionToken: "c"
    });
    headObject.mockResolvedValueOnce({ Metadata: { "ipfs-hash": "cid123" } });
    uuid.mockReturnValueOnce("uuid");
    immutableMock.mockReturnValue("acl");

    const file = new File(["y"], "video.mp4", { type: "video/mp4" });
    Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 });

    const [result] = await uploadToIPFS([file]);

    expect(sts).toHaveBeenCalled();
    expect(done).toHaveBeenCalled();
    expect(headObject).toHaveBeenCalled();
    expect(result).toEqual({ mimeType: "video/mp4", uri: "ipfs://cid123" });
  });

  it("returns empty array on failure", async () => {
    uploadFile.mockRejectedValueOnce(new Error("err"));
    immutableMock.mockReturnValue("acl");

    const file = new File(["z"], "img.jpg", { type: "image/jpeg" });

    const result = await uploadToIPFS([file]);

    expect(result).toEqual([]);
  });
});

describe("uploadFileToIPFS", () => {
  it("returns file metadata from uploadToIPFS", async () => {
    uploadFile.mockResolvedValueOnce({ uri: "ipfs://single" });
    immutableMock.mockReturnValue("acl");

    const file = new File(["a"], "photo.png", { type: "image/png" });

    const result = await uploadFileToIPFS(file);

    expect(result).toEqual({ mimeType: "image/png", uri: "ipfs://single" });
  });

  it("returns fallback when uploadToIPFS throws", async () => {
    const spy = vi
      .spyOn(uploadModule, "default")
      .mockRejectedValueOnce(new Error("err"));
    const file = new File(["a"], "photo.png", { type: "image/png" });

    const result = await uploadFileToIPFS(file);

    expect(result).toEqual({ mimeType: "image/png", uri: "" });
    spy.mockRestore();
  });
});
