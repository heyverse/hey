import type { Context } from "hono";

const getOEmbed = async (ctx: Context) => {
  const params = ctx.req.param();

  let authorUrl = "https://hey.xyz";
  if (params.slug) {
    authorUrl = `https://hey.xyz/posts/${params.slug}`;
  } else if (params.username) {
    authorUrl = `https://hey.xyz/u/${params.username}`;
  } else if (params.address) {
    authorUrl = `https://hey.xyz/g/${params.address}`;
  }

  const payload = {
    author_name: "Hey",
    author_url: authorUrl,
    provider_name: "Hey",
    provider_url: "https://hey.xyz",
    title: "Embed",
    type: "rich",
    version: "1.0"
  } as const;

  ctx.header("Content-Type", "application/json+oembed");
  return ctx.body(JSON.stringify(payload));
};

export default getOEmbed;
