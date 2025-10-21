import type { Context } from "hono";
import type { Hex } from "viem";
import { getRecord } from "./query";
import { decodeEnsOffchainRequest, encodeEnsOffchainResponse } from "./utils";

const CCIP = async (ctx: Context) => {
  const sender = ctx.req.param("sender");
  const dataParam = ctx.req.param("data");
  if (!sender || !dataParam) return ctx.json({ error: "Bad Request" }, 400);

  let result: string;

  try {
    const param = { data: dataParam as Hex, sender: sender as Hex };
    const { name, query } = decodeEnsOffchainRequest(param);
    result = await getRecord(name, query);
    const data = await encodeEnsOffchainResponse(
      param,
      result,
      process.env.PRIVATE_KEY as Hex
    );

    return ctx.json({ data }, 200);
  } catch {
    return ctx.json({ error: "Bad Request" }, 400);
  }
};

export default CCIP;
