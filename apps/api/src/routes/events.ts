import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import { zeroAddress } from "viem";
import getIpData from "@/utils/getIpData";
import handleApiError from "@/utils/handleApiError";

const events = async (ctx: Context) => {
  try {
    const body = await ctx.req.json();
    const event = body.event?.trim();
    const address = ctx.get("account") ?? zeroAddress;
    const ipData = getIpData(ctx);

    if (!event) {
      ctx.status(400);
      return ctx.json({ status: Status.Error });
    }

    await fetch("https://yoginth.com/api/hey/events", {
      body: JSON.stringify({ address, event, ipData }),
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      method: "POST"
    });

    return ctx.json({ status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default events;
