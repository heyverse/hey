import {
  DEFAULT_AVATAR,
  TRANSFORMS,
  type Transform
} from "@hey/data/constants";
import imageKit from "./imageKit";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

interface EntityWithAvatar {
  metadata?: {
    picture?: string | null;
    icon?: string | null;
  } | null;
}

const getAvatar = (
  entity: EntityWithAvatar | null | undefined,
  namedTransform: Transform = TRANSFORMS.AVATAR_SMALL
): string => {
  if (!entity) {
    return DEFAULT_AVATAR;
  }

  const avatarUrl =
    entity?.metadata?.picture || entity?.metadata?.icon || DEFAULT_AVATAR;

  const sanitized = sanitizeDStorageUrl(avatarUrl);

  if (!sanitized || !/^https?:\/\//.test(sanitized)) {
    return DEFAULT_AVATAR;
  }

  return imageKit(sanitized, namedTransform);
};

export default getAvatar;
