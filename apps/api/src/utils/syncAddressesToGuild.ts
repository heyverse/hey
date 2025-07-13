import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Status } from "@hey/data/enums";
import logger from "@hey/helpers/logger";
import signer from "./signer";

const guildClient = createGuildClient("heyxyz");
const signerFunction = createSigner.custom(
  (message) => signer.signMessage({ message }),
  signer.account.address
);
const {
  guild: {
    role: { requirement: requirementClient }
  }
} = guildClient;

const syncAddressesToGuild = async ({
  addresses,
  requirementId,
  roleId
}: {
  addresses: string[];
  requirementId: number;
  roleId: number;
}) => {
  // Run the sync operation in the background without awaiting
  requirementClient
    .update(
      7465,
      roleId,
      requirementId,
      { data: { addresses, hideAllowlist: true }, visibility: "PUBLIC" },
      signerFunction
    )
    .then(() => {
      logger.info("Guild sync completed");
    })
    .catch((error) => {
      logger.error("Guild sync failed:", error);
    });

  return {
    status: Status.Success,
    total: addresses.length,
    updatedAt: new Date().toISOString()
  };
};

export default syncAddressesToGuild;
