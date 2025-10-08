import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import getIpData from "@/utils/getIpData";
import handleApiError from "@/utils/handleApiError";

const events = async (ctx: Context) => {
  try {
    const body = await ctx.req.json();
    const event = body.event?.trim();
    const ipData = getIpData(ctx);
    const country = ipData.countryCode;
    const region = ipData.region;
    const owner = ctx.get("owner");

    if (!event) {
      ctx.status(400);
      return ctx.json({ status: Status.Error });
    }

    await fetch("https://yoginth.com/api/hey/events", {
      body: JSON.stringify({ country, event, owner, region }),
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
