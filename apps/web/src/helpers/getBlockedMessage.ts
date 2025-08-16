import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";

const formatMessage = (
  account: AccountFragment,
  formatter: (username: string) => string
): string => {
  const { usernameWithPrefix } = getAccount(account);

  return formatter(usernameWithPrefix);
};

export const getBlockedByMeMessage = (account: AccountFragment): string =>
  formatMessage(account, (username) => `You have blocked ${username}`);

export const getBlockedMeMessage = (account: AccountFragment): string =>
  formatMessage(account, (username) => `${username} has blocked you`);
