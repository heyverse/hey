import { PERMISSIONS } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import handleApiError from "@/utils/handleApiError";
import lensPg from "@/utils/lensPg";

const totalSubscribers = async (ctx: Context) => {
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

    return ctx.json({
      status: Status.Success,
      total: addresses.length,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default totalSubscribers;
