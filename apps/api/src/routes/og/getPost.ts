import { STATIC_IMAGES_URL, TRANSFORMS } from "@hey/data/constants";
import escapeHtml from "@hey/helpers/escapeHtml";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getPostData from "@hey/helpers/getPostData";
import normalizeDescription from "@hey/helpers/normalizeDescription";
import { PostDocument, type PostFragment } from "@hey/indexer";
import type { Context } from "hono";
import { html } from "hono/html";
import generateOg from "./ogUtils";

const getPost = async (ctx: Context) => {
  const { slug } = ctx.req.param();
  const cacheKey = `og:post:${slug}`;

  return generateOg({
    buildHtml: (post: PostFragment, _jsonLd) => {
      const { author, metadata } = post;
      const { usernameWithPrefix } = getAccount(author);
      const filteredContent = getPostData(metadata)?.content || "";
      const title = `${post.__typename} by ${usernameWithPrefix} on Hey`;
      const description = normalizeDescription(filteredContent, title);
      const postUrl = `https://hey.xyz/posts/${post.slug}`;

      const escTitle = escapeHtml(title);
      const escDescription = escapeHtml(description);

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
            <meta property="og:type" content="article" />
            <meta property="og:site_name" content="Hey" />
            <meta property="og:url" content="https://hey.xyz/posts/${post.slug}" />
            <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
            <meta property="og:image" content="${getAvatar(author, TRANSFORMS.AVATAR_BIG)}" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="${escTitle}" />
            <meta name="twitter:description" content="${escDescription}" />
            <meta property="twitter:image" content="${getAvatar(author, TRANSFORMS.AVATAR_BIG)}" />
            <meta name="twitter:site" content="@heydotxyz" />
            <link rel="canonical" href="https://hey.xyz/posts/${post.slug}" />
          </head>
          <body>
            <h1>${escTitle}</h1>
            <h2>${escDescription}</h2>
            <div>
              <b>Stats</b>
              <ul>
                <li><a href="${postUrl}">Collects: ${post.stats.collects}</a></li>
                <li><a href="${postUrl}">Tips: ${post.stats.tips}</a></li>
                <li><a href="${postUrl}">Comments: ${post.stats.comments}</a></li>
                <li><a href="${postUrl}">Likes: ${post.stats.reactions}</a></li>
                <li><a href="${postUrl}">Reposts: ${post.stats.reposts}</a></li>
                <li><a href="${postUrl}/quotes">Quotes: ${post.stats.quotes}</a></li>
              </ul>
            </div>
          </body>
        </html>
      `;
    },
    buildJsonLd: (post: PostFragment) => {
      const { author, metadata } = post;
      const { usernameWithPrefix } = getAccount(author);
      const filteredContent = getPostData(metadata)?.content || "";
      const title = `${post.__typename} by ${usernameWithPrefix} on Hey`;
      const description = normalizeDescription(filteredContent, title);

      return {
        "@context": "https://schema.org",
        "@id": `https://hey.xyz/posts/${post.slug}`,
        "@type": "Article",
        author: usernameWithPrefix,
        description,
        headline: title,
        image: getAvatar(author, TRANSFORMS.AVATAR_BIG),
        publisher: { "@type": "Organization", name: "Hey.xyz" },
        url: `https://hey.xyz/posts/${post.slug}`
      };
    },
    cacheKey,
    ctx,
    extractData: (data) => data.post as PostFragment | null,
    query: PostDocument,
    variables: { request: { post: slug } }
  });
};

export default getPost;
