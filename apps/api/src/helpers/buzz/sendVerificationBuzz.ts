import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountDocument, type AccountFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Address } from "viem";
import sendBuzz from "./sendBuzz";

/**
 * Sends a verification buzz to a Discord webhook for a specific account operation.
 *
 * @param {object} params - The parameters for sending the verification buzz.
 * @param {Address} params.account - The account address associated with the operation.
 * @param {string} params.operation - The operation being verified.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the buzz was sent successfully, otherwise `false`.
 */
const sendVerificationBuzz = async ({
  account,
  operation
}: { account: Address; operation: string }): Promise<boolean> => {
  try {
    const { data } = await apolloClient().query({
      query: AccountDocument,
      variables: { request: { address: account } }
    });

    const accountData = data?.account as AccountFragment;

    if (!accountData) {
      return false;
    }

    const { usernameWithPrefix } = getAccount(accountData);

    return sendBuzz({
      title: `🔀 Operation ➜ ${operation}`,
      footer: {
        text: `By ${usernameWithPrefix}`,
        icon_url: getAvatar(accountData)
      },
      topic: process.env.DISCORD_EVENT_WEBHOOK_TOPIC
    });
  } catch {
    return false;
  }
};

export default sendVerificationBuzz;
