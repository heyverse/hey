import getAccount from "@hey/helpers/getAccount";
import sendBuzz from "@hey/helpers/sendBuzz";
import { AccountDocument, type AccountFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Address } from "viem";

const fetchAccountData = async (
  account: Address
): Promise<AccountFragment | null> => {
  const { data } = await apolloClient().query({
    query: AccountDocument,
    variables: { request: { address: account } }
  });

  return (data?.account as AccountFragment) || null;
};

const createBuzzTitle = (
  operation: string,
  usernameWithPrefix: string
): string => {
  return `🔀 Operation ➜ ${operation} | By ${usernameWithPrefix}`;
};

const sendVerificationBuzz = async ({
  account,
  operation
}: { account: Address; operation: string }): Promise<boolean> => {
  try {
    const accountData = await fetchAccountData(account);
    if (!accountData) {
      return false;
    }

    const { usernameWithPrefix } = getAccount(accountData);
    const title = createBuzzTitle(operation, usernameWithPrefix);

    return sendBuzz({
      title,
      footer: `By ${usernameWithPrefix}`,
      topic: process.env.DISCORD_EVENT_WEBHOOK_TOPIC
    });
  } catch {
    return false;
  }
};

export default sendVerificationBuzz;
