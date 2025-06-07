import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { PostMetadataFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getPostData from "./getPostData";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const ipfs = `Qm${"a".repeat(44)}`;
const sanitized = sanitizeDStorageUrl(ipfs);

describe("getPostData", () => {
  it("handles text-only metadata", () => {
    const meta = {
      __typename: "TextOnlyMetadata",
      content: "hi"
    } as unknown as PostMetadataFragment;
    expect(getPostData(meta)).toEqual({ content: "hi" });
  });

  it("handles image metadata", () => {
    const meta = {
      __typename: "ImageMetadata",
      content: "img",
      image: { item: ipfs },
      attachments: [{ __typename: "MediaImage", item: ipfs }]
    } as unknown as PostMetadataFragment;
    expect(getPostData(meta)).toEqual({
      asset: { type: "Image", uri: sanitized },
      attachments: [{ type: "Image", uri: sanitized }],
      content: "img"
    });
  });

  it("handles audio metadata with placeholder", () => {
    const meta = {
      __typename: "AudioMetadata",
      content: "audio",
      title: undefined,
      audio: { item: ipfs, cover: undefined, artist: undefined },
      attachments: []
    } as unknown as PostMetadataFragment;
    expect(getPostData(meta)).toEqual({
      asset: {
        artist: undefined,
        cover: sanitizeDStorageUrl(PLACEHOLDER_IMAGE),
        title: "Untitled",
        type: "Audio",
        uri: ipfs
      },
      content: "audio"
    });
  });

  it("returns null for unknown type", () => {
    expect(
      getPostData({ __typename: "Unknown" } as unknown as PostMetadataFragment)
    ).toBeNull();
  });
});
