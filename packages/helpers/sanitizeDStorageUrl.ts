import { IPFS_GATEWAY, STORAGE_NODE_URL } from "@hey/data/constants";

const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return "";
  }

  const ipfsGateway = `${IPFS_GATEWAY}/`;

  let link = hash.replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}/${hash}`);
  link = link.replace("https://ipfs.io/ipfs/", ipfsGateway);
  link = link.replace("ipfs://ipfs/", ipfsGateway);
  link = link.replace("ipfs://", ipfsGateway);
  link = link.replace("lens://", `${STORAGE_NODE_URL}/`);
  link = link.replace("ar://", "https://gateway.arweave.net/");

  return link;
};

export default sanitizeDStorageUrl;
