import { STORAGE_NODE_URL } from "@hey/data/constants";

/**
 * Returns the decentralized storage link for a given hash.
 *
 * @param hash The storage node hash.
 * @returns The decentralized storage link.
 */
const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return "";
  }

  return hash.replace("lens://", `${STORAGE_NODE_URL}/`);
};

export default sanitizeDStorageUrl;
