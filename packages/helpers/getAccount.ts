import type { Account } from "@hey/indexer";
import formatAddress from "./formatAddress";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account: Account | null
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

  const prefix = account.username ? "@" : "#";
  const username =
    (account.username?.value.includes("lens/")
      ? account.username.localName
      : account.username?.value) || formatAddress(account.address);
  const link = account.username
    ? `/u/${account.username.localName}`
    : `/account/${account.address}`;

  return {
    name: sanitizeDisplayName(account.metadata?.name) || username,
    link: link,
    username,
    usernameWithPrefix: `${prefix}${username}`
  };
};

export default getAccount;
