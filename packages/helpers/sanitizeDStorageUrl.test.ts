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

  it("converts https://ipfs.io links", () => {
    const hash = `Qm${"b".repeat(44)}`;
    expect(sanitizeDStorageUrl(`https://ipfs.io/ipfs/${hash}`)).toBe(
      `${ipfsGateway}${hash}`
    );
  });

  it("converts ipfs://ipfs/ links", () => {
    const hash = `Qm${"c".repeat(44)}`;
    expect(sanitizeDStorageUrl(`ipfs://ipfs/${hash}`)).toBe(
      `${ipfsGateway}${hash}`
    );
  });

  it("converts ipfs:// links", () => {
    const hash = `Qm${"d".repeat(44)}`;
    expect(sanitizeDStorageUrl(`ipfs://${hash}`)).toBe(`${ipfsGateway}${hash}`);
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
