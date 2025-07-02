import { PERMISSIONS } from "@hey/data/constants";
import type { Context } from "hono";
import handleApiError from "../../../utils/handleApiError";
import lensPg from "../../../utils/lensPg";
import syncAddressesToGuild from "../../../utils/syncAddressesToGuild";

// Sync accounts that has current subscriber status
const syncSubscribersToGuild = async (ctx: Context) => {
  try {
    const accounts = (await lensPg.query(
      `
        SELECT DISTINCT ksw.owned_by
        FROM account.known_smart_wallet ksw
        WHERE ksw.address IN (
          SELECT member.account
          FROM "group"."member" AS member
          WHERE member."group" = $1
        );
      `,
      [`\\x${PERMISSIONS.SUBSCRIPTION.replace("0x", "").toLowerCase()}`]
    )) as Array<{ owned_by: Buffer }>;

    const addresses = accounts.map((account) =>
      `0x${account.owned_by.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      requirementId: 473346,
      roleId: 174659
    });

    return ctx.json(data);
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default syncSubscribersToGuild;
