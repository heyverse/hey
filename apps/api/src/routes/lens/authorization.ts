import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import handleApiError from "../../utils/handleApiError";

const authorization = async (ctx: Context) => {
  try {
    const authHeader = ctx.req.raw.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ctx.json({ error: "Unauthorized", status: Status.Error }, 401);
    }

    const token = authHeader.split(" ")[1];

    if (token !== process.env.SHARED_SECRET) {
      return ctx.json(
        { error: "Invalid shared secret", status: Status.Error },
        401
      );
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
