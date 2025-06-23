import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Status } from "@hey/data/enums";
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
  const updatedRequirement = await requirementClient.update(
    7465,
    roleId,
    requirementId,
    { data: { addresses, hideAllowlist: true }, visibility: "PUBLIC" },
    signerFunction
  );

  return {
    status: Status.Success,
    total: addresses.length,
    updatedAt: updatedRequirement.updatedAt
  };
};

export default syncAddressesToGuild;
