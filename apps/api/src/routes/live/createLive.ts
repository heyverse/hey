import { LIVEPEER_KEY } from "@hey/data/constants";
import { Status } from "@hey/data/enums";
import generateUUID from "@hey/helpers/generateUUID";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import handleApiError from "@/utils/handleApiError";

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

    const data = (await response.json()) as
      | {
          id: string;
          playbackId: string;
          streamKey: string;
        }
      | { errors: Array<string> };

    if (!response.ok) {
      return ctx.json(
        {
          error:
            "errors" in data && data.errors.length > 0
              ? data.errors[0]
              : "Failed to create stream",
          status: Status.Error
        },
        { status: response.status as ContentfulStatusCode }
      );
    }

    return ctx.json({ data, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default createLive;
