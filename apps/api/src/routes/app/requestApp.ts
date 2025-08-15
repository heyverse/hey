import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import prisma from "@/prisma/client";
import handleApiError from "@/utils/handleApiError";

const requestApp = async (ctx: Context) => {
  try {
    const { email } = await ctx.req.json();
    const account = ctx.get("account");

    const appRequest = await prisma.appRequest.upsert({
      create: { accountAddress: account as string, email },
      update: { email },
      where: { accountAddress: account as string }
    });

    return ctx.json({
      data: {
        requested: Boolean(appRequest?.email),
        requestedAt: appRequest?.createdAt
      },
      status: Status.Success
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default requestApp;
