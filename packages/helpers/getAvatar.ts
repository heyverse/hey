import { AVATAR, IPFS_GATEWAY } from "@hey/data/constants";
import imageKit from "./imageKit";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

/**
 * Returns the avatar image URL for a given profile or group.
 *
 * @param entity The profile or group object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (entity: any, namedTransform = AVATAR): string => {
  const defaultAvatar = `${IPFS_GATEWAY}/Qmb4XppdMDCsS7KCL8nCJo8pukEWeqL4bTghURYwYiG83i/cropped_image.png`;

  if (!entity) {
    return defaultAvatar;
  }

  const avatarUrl =
    entity?.metadata?.picture || entity?.metadata?.icon || defaultAvatar;

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
