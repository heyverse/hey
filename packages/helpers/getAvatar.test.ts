import {
  DEFAULT_AVATAR,
  IPFS_GATEWAY,
  LENS_MEDIA_SNAPSHOT_URL,
  TRANSFORMS
} from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import getAvatar from "./getAvatar";

interface ProfileMock {
  metadata?: {
    picture?: string | null;
    icon?: string | null;
  } | null;
}

describe("getAvatar", () => {
  it("returns default avatar for null entity", () => {
    expect(getAvatar(null)).toBe(DEFAULT_AVATAR);
  });

  it("returns default avatar for invalid picture", () => {
    const entity: ProfileMock = { metadata: { picture: "" } };
    expect(getAvatar(entity)).toBe(DEFAULT_AVATAR);
  });

  it("uses icon when picture is missing", () => {
    const url = `${LENS_MEDIA_SNAPSHOT_URL}/icon.png`;
    const entity: ProfileMock = { metadata: { icon: url, picture: null } };
    const expected = `${LENS_MEDIA_SNAPSHOT_URL}/${TRANSFORMS.AVATAR_SMALL}/icon.png`;
    expect(getAvatar(entity)).toBe(expected);
  });

  it("sanitizes ipfs CIDs", () => {
    const cid = `Qm${"a".repeat(44)}`;
    const entity: ProfileMock = { metadata: { picture: cid } };
    const expected = `${IPFS_GATEWAY}/${cid}`;
    expect(getAvatar(entity)).toBe(expected);
  });

  it("applies imagekit transform for snapshot urls", () => {
    const url = `${LENS_MEDIA_SNAPSHOT_URL}/path/img.jpg`;
    const entity: ProfileMock = { metadata: { picture: url } };
    const expected = `${LENS_MEDIA_SNAPSHOT_URL}/${TRANSFORMS.AVATAR_BIG}/img.jpg`;
    expect(getAvatar(entity, TRANSFORMS.AVATAR_BIG)).toBe(expected);
  });
});
