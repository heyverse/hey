import {
  DEFAULT_AVATAR,
  LENS_MEDIA_SNAPSHOT_URL,
  STORAGE_NODE_URL,
  TRANSFORMS
} from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import getAvatar from "./getAvatar";

const ipfs = "ipfs://avatarHash";

describe("getAvatar", () => {
  it("returns default when entity missing", () => {
    expect(getAvatar(undefined as any)).toBe(DEFAULT_AVATAR);
  });

  it("uses icon when picture missing", () => {
    const icon = "ipfs://iconHash";
    const avatar = getAvatar({ metadata: { picture: null, icon } });
    expect(avatar).toContain("iconHash");
  });

  it("falls back to default when both missing", () => {
    expect(getAvatar({ metadata: {} })).toBe(DEFAULT_AVATAR);
  });

  it("sanitizes ipfs avatar", () => {
    const avatar = getAvatar({ metadata: { picture: ipfs } });
    expect(avatar).toContain("gw.ipfs-lens.dev/ipfs/avatarHash");
  });

  it("applies imageKit transform", () => {
    const url = `${LENS_MEDIA_SNAPSHOT_URL}/path/file.png`;
    const result = getAvatar(
      { metadata: { picture: url } },
      TRANSFORMS.AVATAR_TINY
    );
    expect(result).toBe(
      `${LENS_MEDIA_SNAPSHOT_URL}/${TRANSFORMS.AVATAR_TINY}/file.png`
    );
  });

  it("returns default for malformed url", () => {
    const avatar = getAvatar({ metadata: { picture: "ftp://bad" } });
    expect(avatar).toBe(DEFAULT_AVATAR);
  });

  it("sanitizes lens uri avatar", () => {
    const lensUri = "lens://abcdef";
    const avatar = getAvatar({ metadata: { picture: lensUri } });
    expect(avatar).toBe(`${STORAGE_NODE_URL}/abcdef`);
  });
});
