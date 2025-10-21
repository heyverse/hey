import type { Context } from "hono";
import getLensAccount from "@/utils/getLensAccount";

const getAccount = async (ctx: Context) => {
  const name = ctx.req.query("name");
  if (!name) return ctx.json({ error: "Missing name" }, 400);

  const lower = name.toLowerCase();
  if (!lower.endsWith(".hey.xyz")) {
    return ctx.json({ error: "Unsupported domain" }, 400);
  }

  const label = lower.split(".hey.xyz")[0];
  if (!label || label.includes(".")) {
    return ctx.json({ error: "Invalid label" }, 400);
  }

  const account = await getLensAccount(label);

  return ctx.json({ account });
};

export default getAccount;
