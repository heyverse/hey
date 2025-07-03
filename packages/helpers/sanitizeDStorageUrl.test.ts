import { IPFS_GATEWAY, STORAGE_NODE_URL } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const ipfsGateway = `${IPFS_GATEWAY}/`;

describe("sanitizeDStorageUrl", () => {
  it("returns an empty string when url is undefined", () => {
    expect(sanitizeDStorageUrl()).toBe("");
  });

  it("handles bare IPFS hashes", () => {
    const hash = `Qm${"a".repeat(44)}`;
    expect(sanitizeDStorageUrl(hash)).toBe(`${ipfsGateway}${hash}`);
  });

  it("converts common ipfs url formats", () => {
    const formats = ["https://ipfs.io/ipfs/", "ipfs://ipfs/", "ipfs://"];
    const hash = `Qm${"b".repeat(44)}`;
    for (const prefix of formats) {
      expect(sanitizeDStorageUrl(`${prefix}${hash}`)).toBe(
        `${ipfsGateway}${hash}`
      );
    }
  });

  it("converts lens:// links", () => {
    expect(sanitizeDStorageUrl("lens://abc")).toBe(`${STORAGE_NODE_URL}/abc`);
  });

  it("converts ar:// links", () => {
    expect(sanitizeDStorageUrl("ar://xyz")).toBe(
      "https://gateway.arweave.net/xyz"
    );
  });
});
