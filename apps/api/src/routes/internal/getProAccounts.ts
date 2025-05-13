import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import lensPg from "src/utils/lensPg";

const getProAccounts = async (ctx: Context) => {
  try {
    const proAccounts = await lensPg.query(
      `
        SELECT DISTINCT aksw.owned_by
        FROM post.action_executed pae
        JOIN account.known_smart_wallet aksw
          ON pae.account = aksw.address
        WHERE pae.post_id = '\\x001c62d4107cdb7d7508146ca1aa6b289d6bb5d41adb6455df747153334669ba'
          AND pae.timestamp >= NOW() - INTERVAL '30 days'
          AND pae.type = 'TippingPostAction'
          AND pae.decoded_params->>'value' = '0x29a2241af62c0000'
          AND pae.decoded_params->>'currency' = '0x6bdc36e20d267ff0dd6097799f82e78907105e2f';
      `
    );

    return ctx.text(
      proAccounts
        .map((account) => `0x${account.owned_by.toString("hex")}`)
        .join("\n")
    );
  } catch (e) {
    console.error(e);
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default getProAccounts;
