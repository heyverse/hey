import type { Context } from "hono";

interface PageviewBody {
  path?: string;
}

const getIpData = (ctx: Context) => {
  const h = (name: string) => ctx.req.header(name) ?? "";
  return {
    city: h("cf-ipcity"),
    countryCode: h("cf-ipcountry"),
    ip: h("cf-connecting-ip"),
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
    return ctx.json({ ok: true, skipped: true });
  }

  const payload = {
    ...ipData,
    host,
    path: body.path || "",
    ts
  };

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

    add("Path", payload.path);
    add("Location", location, true);
    add("IP", payload.ip, true);

    const embed = {
      color: 0x5865f2,
      fields,
      thumbnail: { url: "https://static.hey.xyz/images/app-icon/0.png" },
      timestamp: payload.ts,
      title: "Pageview"
    };

    const res = await fetch(
      "https://canary.discord.com/api/webhooks/1418962453630554276/HJbxI8QFUkqxZLeqX7piFLa6vTITSZu1QS-L3RL3TH7ZAD8pHLMMRCODMcWIuofZklx9",
      {
        body: JSON.stringify({ embeds: [embed] }),
        headers: { "content-type": "application/json" },
        method: "POST"
      }
    );

    console.log("Sent pageview webhook", res.status);
  } catch (err) {
    console.error("Failed to send pageview webhook", err);
  }

  return ctx.json({ ok: true });
};

export default pageview;
