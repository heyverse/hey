import { ERRORS } from "@hey/data/errors";
import type { Context } from "hono";
import getDbPostId from "src/utils/getDbPostId";
import lensPg from "src/utils/lensPg";

const getStats = async (ctx: Context) => {
  try {
    const { address, post } = await ctx.req.json();

    if (!address) {
      return ctx.json({ success: false, error: "Address is required" }, 400);
    }

    const accounts = (await lensPg.query(
      `
        SELECT address
        FROM account.known_smart_wallet
        WHERE owned_by = $1;
      `,
      [address.replace("0x", "\\x")]
    )) as Array<{ address: Buffer }>;

    const result = await lensPg.query(
      `
        SELECT 'tip' AS type, COUNT(*) AS count
        FROM post.action_executed
        WHERE account = ANY($1::bytea[])
          AND post_id = $2
          AND type = 'TippingPostAction'
        
        UNION ALL
    
        SELECT 'quote', COUNT(*)
        FROM post.record
        WHERE account = ANY($1::bytea[])
          AND is_deleted = false
          AND quoted_post = $2
          AND post_types @> '{quote}'
        
        UNION ALL
    
        SELECT 'comment', COUNT(*)
        FROM post.record
        WHERE account = ANY($1::bytea[])
          AND is_deleted = false
          AND parent_post = $2
          AND post_types @> '{comment}'
        ;
      `,
      [
        accounts.map((account) => `\\x${account.address.toString("hex")}`),
        getDbPostId(post)
      ]
    );

    return ctx.json({
      success: true,
      tips: Number(result[0].count),
      quotes: Number(result[1].count),
      comments: Number(result[2].count)
    });
  } catch {
    return ctx.json({ success: false, error: ERRORS.SomethingWentWrong }, 500);
  }
};

export default getStats;
