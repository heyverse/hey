import { LIVEPEER_KEY } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import generateUUID from "@hey/helpers/generateUUID";
import type { Context } from "hono";

const createLive = async (ctx: Context) => {
  try {
    const { record } = await ctx.req.json();
    const account = ctx.get("account");

    const response = await fetch("https://livepeer.studio/api/stream", {
      body: JSON.stringify({
        name: `${account}-${generateUUID()}`,
        profiles: [
          {
            bitrate: 3000000,
            fps: 0,
            height: 720,
            name: "720p0",
            width: 1280
          },
          {
            bitrate: 6000000,
            fps: 0,
            height: 1080,
            name: "1080p0",
            width: 1920
          }
        ],
        record
      }),
      headers: {
        Authorization: `Bearer ${LIVEPEER_KEY}`,
        "content-type": "application/json"
      },
      method: "POST"
    });

    return ctx.json({
      success: true,
      data: (await response.json()) as {
        id: string;
        playbackId: string;
        streamKey: string;
      }
    });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default createLive;
