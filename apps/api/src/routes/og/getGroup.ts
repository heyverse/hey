import { STATIC_IMAGES_URL, TRANSFORMS } from "@hey/data/constants";
import getAvatar from "@hey/helpers/getAvatar";
import { GroupDocument, type GroupFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import { html, raw } from "hono/html";
import defaultMetadata from "src/utils/defaultMetadata";
import { getRedis, setRedis } from "src/utils/redis";

const getGroup = async (ctx: Context) => {
  try {
    const { address } = ctx.req.param();

    const cacheKey = `og:group:${address}`;
    const cachedGroup = await getRedis(cacheKey);

    if (cachedGroup) {
      return ctx.html(cachedGroup, 200);
    }

    const { data } = await apolloClient.query({
      query: GroupDocument,
      variables: { request: { group: address } },
      fetchPolicy: "no-cache"
    });

    if (!data.group) {
      return ctx.html(defaultMetadata, 404);
    }

    const group = data.group as GroupFragment;
    const name = group.metadata?.name || "Group";
    const title = `${name} on Hey`;
    const description = (group?.metadata?.description || title).slice(0, 155);
    const avatar = getAvatar(group, TRANSFORMS.AVATAR_BIG);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `https://hey.xyz/g/${address}`,
      name,
      alternateName: address,
      description,
      image: avatar,
      url: `https://hey.xyz/g/${address}`,
      memberOf: { "@type": "Organization", name: "Hey.xyz" }
    };

    const escapedJsonLd = JSON.stringify(jsonLd)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");

    const ogHtml = html`
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>${title}</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:type" content="profile" />
          <meta property="og:site_name" content="Hey" />
          <meta property="og:url" content="https://hey.xyz/g/${group.address}" />
          <meta property="og:image" content="${avatar}" />
          <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta property="twitter:image" content="${avatar}" />
          <meta name="twitter:site" content="@heydotxyz" />
          <link rel="canonical" href="https://hey.xyz/g/${group.address}" />
        </head>
        <body>
          <script type="application/ld+json">${raw(escapedJsonLd)}</script>
          <img src="${avatar}" alt="${title}" height="100" width="100" />
          <h1>${name}</h1>
          <h2>${description}</h2>
        </body>
      </html>
    `;

    const cleanHtml = ogHtml.toString().replace(/\n\s+/g, "").trim();
    await setRedis(cacheKey, cleanHtml);

    return ctx.html(cleanHtml, 200);
  } catch {
    return ctx.html(defaultMetadata, 500);
  }
};

export default getGroup;
