import { Regex } from "@hey/data/regex";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { staffAccess } from "../../../middlewares/staffAccess";
import { authedProcedure } from "../../../procedures/authedProcedure";

const ParamsSchema = z.object({
  account: z.string().regex(Regex.evmAddress),
  permission: z.string(),
  enabled: z.boolean()
});

const ResponseSchema = z.object({
  enabled: z.boolean()
});

export const assignPermission = authedProcedure
  .use(staffAccess)
  .input(ParamsSchema)
  .output(ResponseSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { account, permission, enabled } = input;

      if (enabled) {
        await ctx.prisma.accountPermission.create({
          data: { permissionId: permission, accountAddress: account }
        });

        return { enabled };
      }

      await ctx.prisma.accountPermission.deleteMany({
        where: { permissionId: permission, accountAddress: account }
      });

      return { enabled };
    } catch {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
