import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Status } from "@hey/data/enums";
import { withPrefix } from "@hey/helpers/logger";
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
  const log = withPrefix("[API]");
  requirementClient
    .update(
      7465,
      roleId,
      requirementId,
      { data: { addresses, hideAllowlist: true }, visibility: "PUBLIC" },
      signerFunction
    )
    .then(() => {
      log.info("Guild sync completed");
    })
    .catch((error) => {
      log.error("Guild sync failed:", error);
    });

  return {
    status: Status.Success,
    total: addresses.length,
    updatedAt: new Date().toISOString()
  };
};

export default syncAddressesToGuild;
