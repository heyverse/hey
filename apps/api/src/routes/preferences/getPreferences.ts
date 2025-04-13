import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import prisma from "src/prisma/client";

const getPreferences = async (ctx: Context) => {
  try {
    const account = ctx.get("account");

    const [preference, permissions] = await prisma.$transaction([
      prisma.preference.findUnique({
        where: { accountAddress: account as string }
      }),
      prisma.accountPermission.findMany({
        include: { permission: { select: { key: true } } },
        where: { enabled: true, accountAddress: account as string }
      })
    ]);

    return ctx.json({
      success: true,
      data: {
        appIcon: preference?.appIcon || 0,
        includeLowScore: Boolean(preference?.includeLowScore),
        permissions: permissions.map(({ permission }) => permission.key)
      }
    });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getPreferences;
