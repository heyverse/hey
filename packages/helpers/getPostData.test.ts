import type { PostMetadataFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getPostData from "./getPostData";

const ipfsGateway = "https://gw.ipfs-lens.dev/ipfs";

describe("getPostData", () => {
  it("returns content for TextOnlyMetadata", () => {
    const metadata = {
      __typename: "TextOnlyMetadata",
      content: "hello"
    } as unknown as PostMetadataFragment;

    const result = getPostData(metadata);
    expect(result).toEqual({ content: "hello" });
  });

  it("parses ImageMetadata and sanitizes asset uri", () => {
    const metadata = {
      __typename: "ImageMetadata",
      attachments: undefined,
      content: "photo",
      image: { item: "ipfs://ipfs/QmImage" }
    } as unknown as PostMetadataFragment;

    const result = getPostData(metadata);
    expect(result).toEqual({
      asset: { type: "Image", uri: `${ipfsGateway}/QmImage` },
      attachments: [],
      content: "photo"
    });
  });

  it("uses attachment fallback data for AudioMetadata", () => {
    const metadata = {
      __typename: "AudioMetadata",
      attachments: [
        {
          __typename: "MediaAudio",
          artist: "DJ",
          cover: "ipfs://cover1",
          item: "ipfs://audio1"
        }
      ],
      audio: { artist: undefined, cover: "", item: "" },
      content: "listen",
      title: "My Song"
    } as unknown as PostMetadataFragment;

    const result = getPostData(metadata);
    expect(result).toEqual({
      asset: {
        artist: "DJ",
        cover: `${ipfsGateway}/cover1`,
        title: "My Song",
        type: "Audio",
        uri: `${ipfsGateway}/audio1`
      },
      content: "listen"
    });
  });

  it("returns null for unknown metadata", () => {
    const metadata = {
      __typename: "UnknownPostMetadata"
    } as unknown as PostMetadataFragment;

    const result = getPostData(metadata);
    expect(result).toBeNull();
  });
});
