import { HEY_ENS_NAMESPACE } from "@hey/data/constants";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import lensPg from "@/utils/lensPg";
import syncAddressesToGuild from "@/utils/syncAddressesToGuild";

// Sync accounts that have Hey Names
const syncHeyNamesMembersToGuild = async (ctx: Context) => {
  try {
    const accounts = (await lensPg.query(
      `
        SELECT DISTINCT ksw.owned_by
        FROM account.known_smart_wallet ksw
        INNER JOIN username.record AS member ON ksw.address = member.account
        WHERE member.namespace = $1;
      `,
      [`\\x${HEY_ENS_NAMESPACE.replace("0x", "").toLowerCase()}`]
    )) as Array<{ owned_by: Buffer }>;

    const addresses = accounts.map((account) =>
      `0x${account.owned_by.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      requirementId: 479750,
      roleId: 177950
    });

    return ctx.json(data);
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default syncHeyNamesMembersToGuild;
