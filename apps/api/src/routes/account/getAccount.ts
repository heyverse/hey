import { Errors } from "@hey/data/errors";
import { PermissionId } from "@hey/data/permissions";
import type { Context } from "hono";
import prisma from "src/prisma/client";
import { getRedis, setRedis } from "src/utils/redis";

const getAccount = async (ctx: Context) => {
  try {
    const { address } = ctx.req.param();

    const cacheKey = `account:${address}`;
    const cachedAccount = await getRedis(cacheKey);

    if (cachedAccount) {
      return ctx.json({
        success: true,
        cached: true,
        data: JSON.parse(cachedAccount)
      });
    }

    const accountPermission = await prisma.accountPermission.findFirst({
      where: {
        permissionId: PermissionId.Suspended,
        accountAddress: address
      }
    });

    const data = {
      isSuspended: accountPermission?.permissionId === PermissionId.Suspended
    };

    await setRedis(cacheKey, JSON.stringify(data));

    return ctx.json({ success: true, data });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getAccount;
