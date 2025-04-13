import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import prisma from "src/prisma/client";

const getAccount = async (ctx: Context) => {
  try {
    const { address } = ctx.req.param();
    const [preference, permissions] = await prisma.$transaction([
      prisma.preference.findUnique({
        where: { accountAddress: address }
      }),
      prisma.accountPermission.findMany({
        include: { permission: { select: { key: true } } },
        where: { enabled: true, accountAddress: address }
      })
    ]);

    return ctx.json({
      appIcon: preference?.appIcon || 0,
      includeLowScore: Boolean(preference?.includeLowScore),
      permissions: permissions.map(({ permission }) => permission.key)
    });
  } catch {
    return ctx.json({ error: Errors.SomethingWentWrong }, 500);
  }
};

export default getAccount;
