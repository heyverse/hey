import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import getIpData from "./utils/getIpData";

interface PostsBody {
  slug?: string;
  title?: string;
  content?: string;
  type?: string;
}

const posts = async (ctx: Context) => {
  let body: PostsBody = {};
  try {
    body = (await ctx.req.json()) as PostsBody;
  } catch {
    body = {};
  }

  const ipData = getIpData(ctx);
  const host = ctx.req.header("host") ?? "";
  const ts = new Date().toISOString();

  if (host.includes("localhost")) {
    return ctx.json({
      data: { ok: true, skipped: true },
      status: Status.Success
    });
  }

  const payload = { ...ipData, account: ctx.get("account"), host, ts };

  try {
    const trunc = (v: string, max = 1024) =>
      v.length > max ? `${v.slice(0, max - 1)}…` : v;

    const location = [payload.city, payload.region, payload.countryCode]
      .filter(Boolean)
      .join(", ");

    const fields: { inline?: boolean; name: string; value: string }[] = [];
    const add = (name: string, value?: string, inline?: boolean) => {
      if (value) fields.push({ inline, name, value: trunc(value) });
    };

    const postUrl = body.slug
      ? `https://hey.xyz/posts/${body.slug}`
      : undefined;

    add("Account", payload.account, true);
    add("Location", location, true);
    add("Type", body.type, true);
    add("URL", postUrl);
    add("Title", body.title);
    add("Content", body.content);

    const embed = {
      color: 0xfb3a5d,
      fields,
      thumbnail: { url: "https://github.com/heyverse.png" },
      timestamp: payload.ts,
      title: body.title || body.slug || "New Post",
      url: postUrl
    };

    const res = await fetch(
      "https://discord.com/api/webhooks/1419640499504943216/1nNNx7tezx59_gof-EAVWTFIAu3pT2oGZLKxO1dtpOcxM0P5JBEuU-4zvzo_ZF80TZhS",
      {
        body: JSON.stringify({ embeds: [embed] }),
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
