import { AVATAR, DEFAULT_AVATAR } from "@hey/data/constants";
import imageKit from "./imageKit";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

/**
 * Retrieves the avatar URL for a given entity, applying a specified image transformation.
 *
 * @param {any} entity - The entity from which to extract the avatar.
 * @param {string} [namedTransform=AVATAR] - The transformation name to apply to the avatar URL.
 * @returns {string} The transformed avatar URL or a default avatar if the entity is not provided.
 */
const getAvatar = (entity: any, namedTransform = AVATAR): string => {
  if (!entity) {
    return DEFAULT_AVATAR;
  }

  const avatarUrl =
    entity?.metadata?.picture || entity?.metadata?.icon || DEFAULT_AVATAR;

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
