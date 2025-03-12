require("dotenv").config({ override: true });

import { TestnetContracts } from "@hey/data/contracts";
import formatDate from "@hey/helpers/datetime/formatDate";
import getRpc from "@hey/helpers/getRpc";
import logger from "@hey/helpers/logger";
import sendBuzz from "@hey/helpers/sendBuzz";
import { chains } from "@lens-chain/sdk/viem";
import { createPublicClient, formatEther } from "viem";

const checkAndRefillPaymaster = async () => {
  try {
    const publicClient = createPublicClient({
      chain: chains.testnet,
      transport: getRpc({ mainnet: false })
    });

    const paymasterBalance = await publicClient.getBalance({
      address: TestnetContracts.Sponsor
    });
    const balance = formatEther(paymasterBalance);

    sendBuzz({
      title: `💰 Paymaster balance ➜ ${Number(balance).toFixed(4)} GHO`,
      footer: `Checked at ${formatDate(new Date())}`,
      topic: process.env.DISCORD_PAYMASTER_WEBHOOK_TOPIC
    });

    logger.info(`checkAndRefillPaymaster - Paymaster balance: ${balance}`);
  } catch (error) {
    logger.error(
      "checkAndRefillPaymaster - Error checking and refilling paymaster",
      error
    );
  }
};

export default checkAndRefillPaymaster;
