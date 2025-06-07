import { DEFAULT_AVATAR, TRANSFORMS } from "@hey/data/constants";
import imageKit from "./imageKit";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const getAvatar = (
  entity: any,
  namedTransform = TRANSFORMS.AVATAR_SMALL
): string => {
  if (!entity) {
    return DEFAULT_AVATAR;
  }

  const avatarUrl =
    entity?.metadata?.picture || entity?.metadata?.icon || DEFAULT_AVATAR;

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
