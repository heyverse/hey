import { Status } from "@hey/data/enums";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Context } from "hono";
import prisma from "@/prisma/client";
import handleApiError from "@/utils/handleApiError";
import { delRedis } from "@/utils/redis";

const requestApp = async (ctx: Context) => {
  try {
    const { email } = await ctx.req.json();
    const account = ctx.get("account");

    const appRequest = await prisma.appRequest.create({
      data: { accountAddress: account as string, email }
    });

    await delRedis(`app-request:${account}`);

    return ctx.json({
      data: {
        email: appRequest?.email,
        requested: Boolean(appRequest?.email),
        requestedAt: appRequest?.createdAt
      },
      status: Status.Success
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return ctx.json({
          error: "Email already requested",
          status: Status.Error
        });
      }
    }

    return handleApiError(ctx, error);
  }
};

export default requestApp;
