import { PERMISSIONS } from "@hey/data/constants";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import lensPg from "@/utils/lensPg";
import syncAddressesToGuild from "@/utils/syncAddressesToGuild";

// Sync accounts that have current beta status
const syncBetaMembersToGuild = async (ctx: Context) => {
  try {
    const accounts = (await lensPg.query(
      `
        SELECT DISTINCT ksw.owned_by
        FROM account.known_smart_wallet ksw
        INNER JOIN "group"."member" AS member ON ksw.address = member.account
        WHERE member."group" = $1;
      `,
      [`\\x${PERMISSIONS.BETA.replace("0x", "").toLowerCase()}`]
    )) as Array<{ owned_by: Buffer }>;

    const addresses = accounts.map((account) =>
      `0x${account.owned_by.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      requirementId: 479578,
      roleId: 177898
    });

    return ctx.json(data);
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default syncBetaMembersToGuild;
