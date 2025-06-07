import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import syncAddressesToGuild from "src/utils/syncAddressesToGuild";

// Sync accounts with score > 90
const syncHQScoreAccountsToGuild = async (ctx: Context) => {
  try {
    const accounts = (await lensPg.query(
      `
        SELECT DISTINCT account
        FROM ml.account_score
        WHERE score > 90;
      `
    )) as Array<{ account: Buffer }>;

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      roleId: 173446,
      requirementId: 471245
    });

    return ctx.json(data);
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default syncHQScoreAccountsToGuild;
