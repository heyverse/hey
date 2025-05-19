import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";
import syncAddressesToGuild from "src/utils/syncAddressesToGuild";

// Sync accounts that has current pro status
const syncProAccounts = async (ctx: Context) => {
  try {
    const accounts = await lensPg.query(
      `
        SELECT DISTINCT a.owned_by
        FROM post.action_executed e
        JOIN account.known_smart_wallet a
          ON e.account = a.address
        WHERE e.post_id = '\\x001c62d4107cdb7d7508146ca1aa6b289d6bb5d41adb6455df747153334669ba'
          AND e.timestamp >= NOW() - INTERVAL '30 days'
          AND e.type = 'TippingPostAction'
          AND e.decoded_params->>'value' = '0x29a2241af62c0000'
          AND e.decoded_params->>'currency' = '0x6bdc36e20d267ff0dd6097799f82e78907105e2f';
      `
    );

    const addresses = accounts.map((account) =>
      `0x${account.owned_by.toString("hex")}`.toLowerCase()
    );

    const data = await syncAddressesToGuild({
      addresses,
      roleId: 173026,
      requirementId: 470539
    });

    return ctx.json(data);
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default syncProAccounts;
