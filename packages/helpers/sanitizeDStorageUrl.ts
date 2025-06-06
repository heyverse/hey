import { IPFS_GATEWAY, STORAGE_NODE_URL } from "@hey/data/constants";

const sanitizeDStorageUrl = (url?: string): string => {
  if (!url) {
    return "";
  }

  const ipfsGateway = `${IPFS_GATEWAY}/`;

  if (/^Qm[1-9A-Za-z]{44}/.test(url)) {
    return `${ipfsGateway}${url}`;
  }

  return url
    .replace("https://ipfs.io/ipfs/", ipfsGateway)
    .replace("ipfs://ipfs/", ipfsGateway)
    .replace("ipfs://", ipfsGateway)
    .replace("lens://", `${STORAGE_NODE_URL}/`)
    .replace("ar://", "https://gateway.arweave.net/");
};

export default sanitizeDStorageUrl;
