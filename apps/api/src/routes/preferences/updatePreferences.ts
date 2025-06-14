import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import prisma from "src/prisma/client";
import { delRedis } from "src/utils/redis";

const updatePreferences = async (ctx: Context) => {
  try {
    const { appIcon, includeLowScore } = await ctx.req.json();
    const account = ctx.get("account");

    const preference = await prisma.preference.upsert({
      create: { appIcon, includeLowScore, accountAddress: account as string },
      update: { appIcon, includeLowScore },
      where: { accountAddress: account as string }
    });

    await delRedis(`preferences:${account}`);

    return ctx.json({
      success: true,
      data: {
        appIcon: preference.appIcon ?? 0,
        includeLowScore: preference.includeLowScore ?? false
      }
    });
  } catch {
    return ctx.json({ success: false, error: ERRORS.SomethingWentWrong }, 500);
  }
};

export default updatePreferences;
