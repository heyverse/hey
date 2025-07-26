import { STATIC_IMAGES_URL, TRANSFORMS } from "@hey/data/constants";
import escapeHtml from "@hey/helpers/escapeHtml";
import getAvatar from "@hey/helpers/getAvatar";
import normalizeDescription from "@hey/helpers/normalizeDescription";
import { GroupDocument, type GroupFragment } from "@hey/indexer";
import type { Context } from "hono";
import { html, raw } from "hono/html";
import generateOg from "./ogUtils";

const getGroup = async (ctx: Context) => {
  const { address } = ctx.req.param();
  const cacheKey = `og:group:${address}`;

  return generateOg({
    buildHtml: (group: GroupFragment, escapedJsonLd) => {
      const name = group.metadata?.name || "Group";
      const title = `${name} on Hey`;
      const description = normalizeDescription(
        group?.metadata?.description,
        title
      );
      const avatar = getAvatar(group, TRANSFORMS.AVATAR_BIG);

      const escTitle = escapeHtml(title);
      const escDescription = escapeHtml(description);
      const escName = escapeHtml(name);

      return html`
        <html>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="content-language" content="en-US" />
            <title>${escTitle}</title>
            <meta name="description" content="${escDescription}" />
            <meta property="og:title" content="${escTitle}" />
            <meta property="og:description" content="${escDescription}" />
            <meta property="og:type" content="profile" />
            <meta property="og:site_name" content="Hey" />
            <meta property="og:url" content="https://hey.xyz/g/${group.address}" />
            <meta property="og:image" content="${avatar}" />
            <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="${escTitle}" />
            <meta name="twitter:description" content="${escDescription}" />
            <meta property="twitter:image" content="${avatar}" />
            <meta name="twitter:site" content="@heydotxyz" />
            <link rel="canonical" href="https://hey.xyz/g/${group.address}" />
          </head>
          <body>
            <script type="application/ld+json">${raw(escapedJsonLd)}</script>
            <img src="${avatar}" alt="${escTitle}" height="100" width="100" />
            <h1>${escName}</h1>
            <h2>${escDescription}</h2>
          </body>
        </html>
      `;
    },
    buildJsonLd: (group: GroupFragment) => {
      const name = group.metadata?.name || "Group";
      const title = `${name} on Hey`;
      const description = normalizeDescription(
        group?.metadata?.description,
        title
      );

      return {
        "@context": "https://schema.org",
        "@id": `https://hey.xyz/g/${address}`,
        "@type": "Organization",
        alternateName: address,
        description,
        image: getAvatar(group, TRANSFORMS.AVATAR_BIG),
        memberOf: { "@type": "Organization", name: "Hey.xyz" },
        name,
        url: `https://hey.xyz/g/${address}`
      };
    },
    cacheKey,
    ctx,
    extractData: (data) => data.group as GroupFragment | null,
    query: GroupDocument,
    variables: { request: { group: address } }
  });
};

export default getGroup;
