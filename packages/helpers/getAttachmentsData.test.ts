import { describe, expect, it } from "vitest";
import getAttachmentsData from "./getAttachmentsData";

const IPFS_GATEWAY = "https://gw.ipfs-lens.dev/ipfs";
const STORAGE_NODE_URL = "https://api.grove.storage";

describe("getAttachmentsData", () => {
  it("returns empty array when attachments are undefined", () => {
    const result = getAttachmentsData(undefined);
    expect(result).toEqual([]);
  });

  it("maps attachment fragments to sanitized data", () => {
    const attachments = [
      { __typename: "MediaImage", item: "ipfs://imgHash" },
      {
        __typename: "MediaVideo",
        cover: "ar://coverHash",
        item: "ipfs://videoHash"
      },
      {
        __typename: "MediaAudio",
        artist: "Artist",
        cover: "https://ipfs.io/ipfs/coverHash2",
        item: "lens://audioHash"
      }
    ];

    const result = getAttachmentsData(attachments as any);

    expect(result).toEqual([
      {
        type: "Image",
        uri: `${IPFS_GATEWAY}/imgHash`
      },
      {
        coverUri: "https://gateway.arweave.net/coverHash",
        type: "Video",
        uri: `${IPFS_GATEWAY}/videoHash`
      },
      {
        artist: "Artist",
        coverUri: `${IPFS_GATEWAY}/coverHash2`,
        type: "Audio",
        uri: `${STORAGE_NODE_URL}/audioHash`
      }
    ]);
  });
});
