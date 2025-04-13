import { Access } from "@hey/data/features";
import type { Context, Next } from "hono";
import { type Address, getAddress } from "viem";

const staffAccessMiddleware = async (c: Context, next: Next) => {
  const account = c.get("account");

  const isStaff = Access["staff"]
    .map((account) => getAddress(account))
    .includes(getAddress(account as Address));

  if (!isStaff) {
    return c.body(null, 401);
  }

  return next();
};

export default staffAccessMiddleware;
