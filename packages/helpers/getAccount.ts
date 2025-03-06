import { LENS_NAMESPACE } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import formatAddress from "./formatAddress";
import isAccountDeleted from "./isAccountDeleted";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account?: AccountFragment
): {
  name: string;
  link: string;
  username: string;
  usernameWithPrefix: string;
} => {
  if (!account) {
    return {
      name: "...",
      link: "",
      username: "...",
      usernameWithPrefix: "..."
    };
  }

  if (isAccountDeleted(account)) {
    return {
      name: "Deleted Account",
      link: "",
      username: "deleted",
      usernameWithPrefix: "@deleted"
    };
  }

  const { username, address } = account;

  const usernameValue = username?.value;
  const localName = username?.localName;

  const usernamePrefix = username ? "@" : "#";
  const usernameValueOrAddress =
    (usernameValue?.includes(LENS_NAMESPACE) ? localName : usernameValue) ||
    formatAddress(address);

  const link =
    username && usernameValue.includes(LENS_NAMESPACE)
      ? `/u/${localName}`
      : `/account/${address}`;

  return {
    name: sanitizeDisplayName(account.metadata?.name) || usernameValueOrAddress,
    link,
    username: usernameValueOrAddress,
    usernameWithPrefix: `${usernamePrefix}${usernameValueOrAddress}`
  };
};

export default getAccount;
