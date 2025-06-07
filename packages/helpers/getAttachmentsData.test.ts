import type { AnyMediaFragment } from "@hey/indexer";
import { describe, expect, it } from "vitest";
import getAttachmentsData from "./getAttachmentsData";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const ipfs = `Qm${"a".repeat(44)}`;
const sanitized = sanitizeDStorageUrl(ipfs);

describe("getAttachmentsData", () => {
  it("returns empty array when undefined", () => {
    expect(getAttachmentsData()).toEqual([]);
  });

  it("maps media types", () => {
    const attachments = [
      { __typename: "MediaImage", item: ipfs },
      { __typename: "MediaVideo", item: ipfs, cover: ipfs },
      { __typename: "MediaAudio", item: ipfs, cover: ipfs, artist: "a" }
    ] as unknown as AnyMediaFragment[];
    expect(getAttachmentsData(attachments)).toEqual([
      { type: "Image", uri: sanitized },
      { type: "Video", uri: sanitized, coverUri: sanitized },
      { type: "Audio", uri: sanitized, coverUri: sanitized, artist: "a" }
    ]);
  });
});
