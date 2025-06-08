import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import getPostData from "./getPostData";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const ipfs = `Qm${"a".repeat(44)}`;
const sanitized = sanitizeDStorageUrl(ipfs);

describe("getPostData", () => {
  it("handles text-only metadata", () => {
    const meta = { __typename: "TextOnlyMetadata", content: "hi" } as any;
    expect(getPostData(meta)).toEqual({ content: "hi" });
  });

  it("handles image metadata", () => {
    const meta = {
      __typename: "ImageMetadata",
      content: "img",
      image: { item: ipfs },
      attachments: [{ __typename: "MediaImage", item: ipfs }]
    } as any;
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
    } as any;
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

  it("handles video metadata", () => {
    const meta = {
      __typename: "VideoMetadata",
      content: "video",
      video: { item: ipfs, cover: ipfs },
      attachments: []
    } as any;

    expect(getPostData(meta)).toEqual({
      asset: { cover: sanitized, type: "Video", uri: sanitized },
      content: "video"
    });
  });

  it("handles article metadata", () => {
    const meta = {
      __typename: "ArticleMetadata",
      content: "article",
      attachments: [{ __typename: "MediaImage", item: ipfs }]
    } as any;

    expect(getPostData(meta)).toEqual({
      attachments: [{ type: "Image", uri: sanitized }],
      content: "article"
    });
  });

  it("handles undefined attachments", () => {
    const meta = {
      __typename: "ArticleMetadata",
      content: "attachments none",
      attachments: undefined
    } as any;

    expect(getPostData(meta)).toEqual({
      attachments: [],
      content: "attachments none"
    });
  });

  it("returns null for unknown type", () => {
    expect(getPostData({ __typename: "Unknown" } as any)).toBeNull();
  });
});
