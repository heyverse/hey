import { STATIC_IMAGES_URL, TRANSFORMS } from "@hey/data/constants";
import escapeHtml from "@hey/helpers/escapeHtml";
import { default as getAccountData } from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { AccountDocument } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import { html, raw } from "hono/html";
import defaultMetadata from "src/utils/defaultMetadata";
import { getRedis, setRedis } from "src/utils/redis";

const getAccount = async (ctx: Context) => {
  try {
    const { username } = ctx.req.param();

    const cacheKey = `og:account:${username}`;
    const cachedAccount = await getRedis(cacheKey);

    if (cachedAccount) {
      return ctx.html(cachedAccount, 200);
    }

    const { data } = await apolloClient().query({
      query: AccountDocument,
      variables: { request: { username: { localName: username } } },
      fetchPolicy: "no-cache"
    });

    if (!data.account) {
      return ctx.html(defaultMetadata, 404);
    }

    const account = data.account;
    const { name, link, usernameWithPrefix } = getAccountData(account);
    const title = `${name} (${usernameWithPrefix}) on Hey`;
    const description = (account?.metadata?.bio || title).slice(0, 155);
    const avatar = getAvatar(account, TRANSFORMS.AVATAR_BIG);

    const escTitle = escapeHtml(title);
    const escDescription = escapeHtml(description);
    const escName = escapeHtml(name);
    const escUsernameWithPrefix = escapeHtml(usernameWithPrefix);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `https://hey.xyz/u/${username}`,
      name,
      alternateName: username,
      description,
      image: avatar,
      url: `https://hey.xyz/u/${username}`,
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
          <title>${escTitle}</title>
          <meta name="description" content="${escDescription}" />
          <meta property="og:title" content="${escTitle}" />
          <meta property="og:description" content="${escDescription}" />
          <meta property="og:type" content="profile" />
          <meta property="og:site_name" content="Hey" />
          <meta property="og:url" content="https://hey.xyz${link}" />
          <meta property="og:image" content="${avatar}" />
          <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="${escTitle}" />
          <meta name="twitter:description" content="${escDescription}" />
          <meta property="twitter:image" content="${avatar}" />
          <meta name="twitter:site" content="@heydotxyz" />
          <link rel="canonical" href="https://hey.xyz${link}" />
        </head>
        <body>
          <script type="application/ld+json">${raw(escapedJsonLd)}</script>
          <img src="${avatar}" alt="${escName}" height="100" width="100" />
          <h1>${escName || username}</h1>
          <h2>${escUsernameWithPrefix}</h2>
          <h3>${escDescription}</h3>
        </body>
      </html>
    `;

    const cleanHtml = ogHtml.toString().replace(/\n\s+/g, "").trim();
    await setRedis(cacheKey, cleanHtml);

    return ctx.html(ogHtml, 200);
  } catch {
    return ctx.html(defaultMetadata, 500);
  }
};

export default getAccount;
