import {
  DEFAULT_AVATAR,
  LENS_MEDIA_SNAPSHOT_URL,
  TRANSFORMS
} from "@hey/data/constants";
import { describe, expect, it } from "vitest";
import getAvatar from "./getAvatar";

const ipfs = "ipfs://avatarHash";

describe("getAvatar", () => {
  it("returns default when entity missing", () => {
    expect(getAvatar(undefined as any)).toBe(DEFAULT_AVATAR);
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
});
