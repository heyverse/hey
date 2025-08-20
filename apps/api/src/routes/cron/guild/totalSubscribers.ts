import { PERMISSIONS } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import logger from "@hey/helpers/logger";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import lensPg from "@/utils/lensPg";
import { getRedis, hoursToSeconds, setRedis } from "@/utils/redis";

const totalSubscribers = async (ctx: Context) => {
  try {
    const cacheKey = "total-subscribers";
    const cachedValue = await getRedis(cacheKey);

    // Refresh in background without blocking the response
    (async () => {
      try {
        const accounts = (await lensPg.query(
          `
            SELECT DISTINCT ksw.owned_by
            FROM account.known_smart_wallet ksw
            INNER JOIN "group"."member" AS member ON ksw.address = member.account
            WHERE member."group" = $1;
          `,
          [`\\x${PERMISSIONS.SUBSCRIPTION.replace("0x", "").toLowerCase()}`]
        )) as Array<{ owned_by: Buffer }>;

        const addresses = accounts.map((account) =>
          `0x${account.owned_by.toString("hex")}`.toLowerCase()
        );

        await setRedis(cacheKey, addresses.length, hoursToSeconds(800 * 24));
      } catch (refreshError) {
        logger.error(
          "[total-subscribers] background refresh failed",
          refreshError
        );
      }
    })();

    return ctx.json({
      status: Status.Success,
      total: cachedValue ? Number(cachedValue) : 0
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default totalSubscribers;
