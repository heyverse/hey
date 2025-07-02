import type { Context } from "hono";
import handleApiError from "../../../utils/handleApiError";
import lensPg from "../../../utils/lensPg";
import syncAddressesToGuild from "../../../utils/syncAddressesToGuild";

// Sync followers standing of accounts with 1000+ followers
const syncFollowersStandingToGuild = async (ctx: Context) => {
  try {
    const accounts = (await lensPg.query(
      `
        SELECT account
        FROM account.follower_summary
        WHERE total_followers >= 1000;
      `
    )) as Array<{ account: Buffer }>;

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      requirementId: 471279,
      roleId: 173474
    });

    return ctx.json(data);
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default syncFollowersStandingToGuild;
