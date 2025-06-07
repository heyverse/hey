import { IPFS_GATEWAY, STORAGE_NODE_URL } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

describe("sanitizeDStorageUrl", () => {
  const hash = `Qm${"a".repeat(44)}`;
  it("handles undefined", () => {
    expect(sanitizeDStorageUrl()).toBe("");
  });

  it("prepends gateway for bare hash", () => {
    expect(sanitizeDStorageUrl(hash)).toBe(`${IPFS_GATEWAY}/${hash}`);
  });

  it("converts ipfs://", () => {
    expect(sanitizeDStorageUrl(`ipfs://${hash}`)).toBe(
      `${IPFS_GATEWAY}/${hash}`
    );
  });

  it("converts ipfs://ipfs/", () => {
    expect(sanitizeDStorageUrl(`ipfs://ipfs/${hash}`)).toBe(
      `${IPFS_GATEWAY}/${hash}`
    );
  });

  it("converts ipfs.io gateway", () => {
    expect(sanitizeDStorageUrl(`https://ipfs.io/ipfs/${hash}`)).toBe(
      `${IPFS_GATEWAY}/${hash}`
    );
  });

  it("converts lens://", () => {
    expect(sanitizeDStorageUrl(`lens://${hash}`)).toBe(
      `${STORAGE_NODE_URL}/${hash}`
    );
  });

  it("converts ar://", () => {
    expect(sanitizeDStorageUrl(`ar://${hash}`)).toBe(
      `https://gateway.arweave.net/${hash}`
    );
  });
});
