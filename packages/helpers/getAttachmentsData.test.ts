import { IPFS_GATEWAY, STORAGE_NODE_URL } from "@hey/data/constants";
import type { AnyMediaFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getAttachmentsData from "./getAttachmentsData";

describe("getAttachmentsData", () => {
  it("returns empty array when attachments are undefined", () => {
    expect(getAttachmentsData(undefined)).toEqual([]);
  });

  it("parses image attachments", () => {
    const attachments: AnyMediaFragment[] = [
      { __typename: "MediaImage", item: "ipfs://img" } as AnyMediaFragment
    ];
    expect(getAttachmentsData(attachments)).toEqual([
      { type: "Image", uri: `${IPFS_GATEWAY}/img` }
    ]);
  });

  it("parses video attachments", () => {
    const attachments: AnyMediaFragment[] = [
      {
        __typename: "MediaVideo",
        cover: "ipfs://cover",
        item: "lens://video"
      } as AnyMediaFragment
    ];
    expect(getAttachmentsData(attachments)).toEqual([
      {
        coverUri: `${IPFS_GATEWAY}/cover`,
        type: "Video",
        uri: `${STORAGE_NODE_URL}/video`
      }
    ]);
  });

  it("parses audio attachments", () => {
    const attachments: AnyMediaFragment[] = [
      {
        __typename: "MediaAudio",
        artist: "tester",
        cover: "lens://acover",
        item: "ar://sound"
      } as AnyMediaFragment
    ];
    expect(getAttachmentsData(attachments)).toEqual([
      {
        artist: "tester",
        coverUri: `${STORAGE_NODE_URL}/acover`,
        type: "Audio",
        uri: "https://gateway.arweave.net/sound"
      }
    ]);
  });

  it("returns empty object for unknown types", () => {
    const attachments: AnyMediaFragment[] = [
      {
        __typename: "Unknown",
        item: "ipfs://foo"
      } as unknown as AnyMediaFragment
    ];
    expect(getAttachmentsData(attachments)).toEqual([{}]);
  });
});
