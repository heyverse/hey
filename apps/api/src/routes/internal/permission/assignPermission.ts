import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import prisma from "src/prisma/client";

const assignPermission = async (ctx: Context) => {
  try {
    const { account, permission, enabled } = await ctx.req.json();
    if (enabled) {
      await prisma.accountPermission.create({
        data: { permissionId: permission, accountAddress: account }
      });

      return ctx.json({ success: true, data: { enabled } });
    }

    await prisma.accountPermission.deleteMany({
      where: { permissionId: permission, accountAddress: account }
    });

    return ctx.json({ success: true, data: { enabled } });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default assignPermission;
