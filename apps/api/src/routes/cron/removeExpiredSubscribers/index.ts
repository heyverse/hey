import { PERMISSIONS } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import { withPrefix } from "@hey/helpers/logger";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import lensPg from "@/utils/lensPg";
import signer from "@/utils/signer";
import ABI from "./ABI";

const removeExpiredSubscribers = async (ctx: Context) => {
  try {
    const accounts = (await lensPg.query(
      `
        SELECT account
        FROM "group"."member"
        WHERE "group" = $1
        AND timestamp < NOW() - INTERVAL '365 days'
        LIMIT 1000;
      `,
      [`\\x${PERMISSIONS.SUBSCRIPTION.replace("0x", "").toLowerCase()}`]
    )) as Array<{ account: Buffer }>;

    const addresses = accounts.map((account) =>
      `0x${account.account.toString("hex")}`.toLowerCase()
    );

    if (addresses.length === 0) {
      return ctx.json({
        message: "No expired subscribers",
        status: Status.Success
      });
    }

    const log = withPrefix("[API]");
    const membersToRemove = addresses.map((addr) => ({
      account: addr,
      customParams: [],
      ruleProcessingParams: []
    }));

    signer
      .writeContract({
        abi: ABI,
        address: PERMISSIONS.SUBSCRIPTION,
        args: [membersToRemove, []],
        functionName: "removeMembers"
      })
      .then((hash) => {
        log.info("Expired subscribers removal completed", {
          count: addresses.length,
          hash
        });
      })
      .catch((error) => {
        log.error("Expired subscribers removal failed:", error);
      });

    return ctx.json({
      addresses,
      processedAt: new Date().toISOString(),
      status: Status.Success,
      total: addresses.length
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default removeExpiredSubscribers;
