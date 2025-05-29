import { SUBSCRIPTION_GROUP } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import syncAddressesToGuild from "src/utils/syncAddressesToGuild";

// Sync accounts that has current subscriber status
const syncSubscribersToGuild = async (ctx: Context) => {
  try {
    const accounts = await lensPg.query(
      `
        SELECT account
        FROM "group"."member"
        WHERE "group"::TEXT LIKE $1;
      `,
      [`%${SUBSCRIPTION_GROUP.replace("0x", "").toLowerCase()}%`]
    );

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      roleId: 173026,
      requirementId: 470539
    });

    return ctx.json(data);
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default syncSubscribersToGuild;
