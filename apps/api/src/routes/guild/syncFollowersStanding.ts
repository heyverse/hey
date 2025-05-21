import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import syncAddressesToGuild from "src/utils/syncAddressesToGuild";

// Sync followers standing of accounts with 1000+ followers
const syncFollowersStanding = async (ctx: Context) => {
  try {
    const accounts = await lensPg.query(
      `
        SELECT account
        FROM account.follower_summary
        WHERE total_followers >= 1000;
      `
    );

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      roleId: 173474,
      requirementId: 471279
    });

    return ctx.json(data);
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default syncFollowersStanding;
