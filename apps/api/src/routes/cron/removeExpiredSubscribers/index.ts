import { SUBSCRIPTION_GROUP } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import signer from "src/utils/signer";
import ABI from "./ABI";

const removeExpiredSubscribers = async (ctx: Context) => {
  try {
    const accounts = await lensPg.query(
      `
        SELECT account
        FROM "group"."member"
        WHERE "group"::TEXT LIKE $1
        AND timestamp < NOW() - INTERVAL '365 days'
        LIMIT 1000;
      `,
      [`%${SUBSCRIPTION_GROUP.replace("0x", "").toLowerCase()}%`]
    );

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
      address: SUBSCRIPTION_GROUP,
      functionName: "removeMembers",
      args: [membersToRemove, []]
    });

    return ctx.json({ success: true, addresses, hash });
  } catch (error) {
    console.log(error);
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default removeExpiredSubscribers;
