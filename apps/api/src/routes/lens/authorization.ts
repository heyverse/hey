import { SUSPENDED_ACCOUNTS } from "@hey/data/accounts";
import type { Context } from "hono";
import ApiError from "@/utils/apiError";
import handleApiError from "@/utils/handleApiError";

const authorization = async (ctx: Context) => {
  try {
    const authHeader = ctx.req.raw.headers.get("authorization");
    const { account } = await ctx.req.json();

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    if (token !== process.env.SHARED_SECRET) {
      throw new ApiError(401, "Invalid shared secret");
    }

    if (SUSPENDED_ACCOUNTS.includes(account)) {
      return ctx.json({
        allowed: false,
        reason: "You are suspended!",
        sponsored: false
      });
    }

    return ctx.json({
      allowed: true,
      signingKey: process.env.PRIVATE_KEY,
      sponsored: true
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default authorization;
