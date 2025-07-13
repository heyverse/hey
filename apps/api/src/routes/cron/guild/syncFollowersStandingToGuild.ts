import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import lensPg from "@/utils/lensPg";
import { guildSyncQueue } from "@/utils/queue/GuildSyncQueue";

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

    await guildSyncQueue.addSyncJob(addresses, 471279, 173474);

    return ctx.json({
      addressCount: addresses.length,
      success: true
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default syncFollowersStandingToGuild;
