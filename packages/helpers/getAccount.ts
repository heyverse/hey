import { LENS_NAMESPACE } from "@hey/data/constants";
import { Regex } from "@hey/data/regex";
import type { AccountFragment } from "@hey/indexer";
import formatAddress from "./formatAddress";
import isAccountDeleted from "./isAccountDeleted";

interface AccountInfo {
  name: string;
  link: string;
  username: string;
  usernameWithPrefix: string;
}

const sanitizeDisplayName = (name?: null | string): null | string => {
  if (!name) {
    return null;
  }

  return name.replace(Regex.accountNameFilter, " ").trim().replace(/\s+/g, " ");
};

const UNKNOWN_ACCOUNT: AccountInfo = {
  name: "...",
  link: "",
  username: "...",
  usernameWithPrefix: "..."
};

const DELETED_ACCOUNT: AccountInfo = {
  name: "Deleted Account",
  link: "",
  username: "deleted",
  usernameWithPrefix: "@deleted"
};

const getAccount = (account?: AccountFragment): AccountInfo => {
  if (!account) {
    return UNKNOWN_ACCOUNT;
  }

  if (isAccountDeleted(account)) {
    return DELETED_ACCOUNT;
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
