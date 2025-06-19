import { PERMISSIONS } from "@hey/data/constants";
import type { Context } from "hono";
import handleApiError from "src/utils/handleApiError";
import lensPg from "src/utils/lensPg";
import signer from "src/utils/signer";
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
      return ctx.json({ success: true, message: "No expired subscribers" });
    }

    const membersToRemove = addresses.map((addr) => ({
      account: addr,
      customParams: [],
      ruleProcessingParams: []
    }));

    const hash = await signer.writeContract({
      abi: ABI,
      address: PERMISSIONS.SUBSCRIPTION,
      functionName: "removeMembers",
      args: [membersToRemove, []]
    });

    return ctx.json({ success: true, addresses, hash });
  } catch {
    return handleApiError(ctx);
  }
};

export default removeExpiredSubscribers;
