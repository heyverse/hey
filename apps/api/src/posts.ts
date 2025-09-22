import { Status } from "@hey/data/enums";
import type { Context } from "hono";

interface PostsBody {
  slug?: string;
  type?: string;
}

const posts = async (ctx: Context) => {
  let body: PostsBody = {};
  try {
    body = (await ctx.req.json()) as PostsBody;
  } catch {
    body = {};
  }

  const host = ctx.req.header("host") ?? "";

  if (host.includes("localhost")) {
    return ctx.json({
      data: { ok: true, skipped: true },
      status: Status.Success
    });
  }

  try {
    const postUrl = body.slug
      ? `https://hey.xyz/posts/${body.slug}`
      : undefined;

    const res = await fetch(
      "https://discord.com/api/webhooks/1419640499504943216/1nNNx7tezx59_gof-EAVWTFIAu3pT2oGZLKxO1dtpOcxM0P5JBEuU-4zvzo_ZF80TZhS",
      {
        body: JSON.stringify({ content: `New ${body.type} on Hey ${postUrl}` }),
        headers: { "content-type": "application/json" },
        method: "POST"
      }
    );

    if (res.status === 429) {
      console.warn("Discord webhook rate limited", {
        limit: res.headers.get("x-ratelimit-limit"),
        remaining: res.headers.get("x-ratelimit-remaining"),
        reset: res.headers.get("x-ratelimit-reset"),
        retryAfter: res.headers.get("retry-after")
      });
    }

    console.log("Sent posts webhook", res.status);
  } catch (err) {
    console.error("Failed to send posts webhook", err);
  }

  return ctx.json({ data: { ok: true }, status: Status.Success });
};

export default posts;
