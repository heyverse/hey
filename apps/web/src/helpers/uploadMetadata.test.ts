import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./storageClient", () => ({
  storageClient: { uploadAsJson: vi.fn() }
}));
vi.mock("@lens-chain/storage-client", () => ({
  immutable: vi.fn(() => "acl")
}));

import { CHAIN } from "@hey/data/constants";
import { ERRORS } from "@hey/data/errors";
import { type FileUploadResponse, immutable } from "@lens-chain/storage-client";
import { storageClient } from "./storageClient";
import uploadMetadata from "./uploadMetadata";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadMetadata", () => {
  it("uploads metadata and returns the uri", async () => {
    vi.mocked(storageClient.uploadAsJson).mockResolvedValueOnce({
      uri: "ipfs://meta"
    } as unknown as FileUploadResponse);

    const result = await uploadMetadata({ foo: "bar" });

    expect(immutable).toHaveBeenCalledWith(CHAIN.id);
    expect(storageClient.uploadAsJson).toHaveBeenCalledWith(
      { foo: "bar" },
      { acl: "acl" }
    );
    expect(result).toBe("ipfs://meta");
  });

  it("throws SomethingWentWrong error when upload fails", async () => {
    vi.mocked(storageClient.uploadAsJson).mockRejectedValueOnce(
      new Error("fail")
    );

    await expect(uploadMetadata(null)).rejects.toThrow(
      ERRORS.SomethingWentWrong
    );
  });
});
