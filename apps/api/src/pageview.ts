import { Status } from "@hey/data/enums";
import type { Context } from "hono";

interface PageviewBody {
  path?: string;
}

const getIpData = (ctx: Context) => {
  const h = (name: string) => ctx.req.header(name) ?? "";
  return {
    city: h("cf-ipcity"),
    countryCode: h("cf-ipcountry"),
    region: h("cf-region")
  };
};

const pageview = async (ctx: Context) => {
  let body: PageviewBody = {};
  try {
    body = (await ctx.req.json()) as PageviewBody;
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

  const payload = { ...ipData, host, ts };

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

    add("Path", body.path, true);
    add("Location", location, true);

    const embed = {
      color: 0xfb3a5d,
      fields,
      thumbnail: { url: "https://github.com/heyverse.png" },
      timestamp: payload.ts,
      title: body.path || "Pageview"
    };

    const res = await fetch(
      "https://discord.com/api/webhooks/1418962453630554276/HJbxI8QFUkqxZLeqX7piFLa6vTITSZu1QS-L3RL3TH7ZAD8pHLMMRCODMcWIuofZklx9",
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

    console.log("Sent pageview webhook", res.status);
  } catch (err) {
    console.error("Failed to send pageview webhook", err);
  }

  return ctx.json({ data: { ok: true }, status: Status.Success });
};

export default pageview;
