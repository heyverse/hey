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
      { __typename: "MediaImage", item: "ipfs://photoCid" },
      {
        __typename: "MediaVideo",
        cover: "ar://coverCid",
        item: "ipfs://clipCid"
      },
      {
        __typename: "MediaAudio",
        artist: "DJ Alice",
        cover: "https://ipfs.io/ipfs/coverCid2",
        item: "lens://trackCid"
      }
    ];

    const result = getAttachmentsData(attachments as any);

    expect(result).toEqual([
      {
        type: "Image",
        uri: `${IPFS_GATEWAY}/photoCid`
      },
      {
        coverUri: "https://gateway.arweave.net/coverCid",
        type: "Video",
        uri: `${IPFS_GATEWAY}/clipCid`
      },
      {
        artist: "DJ Alice",
        coverUri: `${IPFS_GATEWAY}/coverCid2`,
        type: "Audio",
        uri: `${STORAGE_NODE_URL}/trackCid`
      }
    ]);
  });
});
