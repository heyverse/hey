import { PERMISSIONS } from "@hey/data/constants";
import type { Context, Next } from "hono";
import lensPg from "@/utils/lensPg";

const proMiddleware = async (c: Context, next: Next) => {
  const account = c.get("account");

  if (!account) {
    return c.body("Unauthorized", 401);
  }

  try {
    const groupMemberShip = (await lensPg.query(
      `
        SELECT account
        FROM "group"."member"
        WHERE "group" = $1 AND account = $2
        LIMIT 1;
      `,
      [
        `\\x${PERMISSIONS.SUBSCRIPTION.replace("0x", "").toLowerCase()}`,
        `\\x${account.replace("0x", "").toLowerCase()}`
      ]
    )) as Array<{ account: Buffer }>;

    const canRequest =
      account === `0x${groupMemberShip[0].account.toString("hex")}`;

    if (!canRequest) {
      return c.body("Unauthorized", 401);
    }

    return next();
  } catch {
    return c.body("Unauthorized", 401);
  }
};

export default proMiddleware;
