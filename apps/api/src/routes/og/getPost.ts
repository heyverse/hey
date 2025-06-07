import { STATIC_IMAGES_URL, TRANSFORMS } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getPostData from "@hey/helpers/getPostData";
import { PostDocument, type PostFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Context } from "hono";
import { html } from "hono/html";
import defaultMetadata from "src/utils/defaultMetadata";
import { getRedis, setRedis } from "src/utils/redis";

const getPost = async (ctx: Context) => {
  try {
    const { slug } = ctx.req.param();
    const cacheKey = `og:post:${slug}`;
    const cachedPost = await getRedis(cacheKey);

    if (cachedPost) {
      return ctx.html(cachedPost, 200);
    }

    const { data } = await apolloClient().query({
      query: PostDocument,
      variables: { request: { post: slug } },
      fetchPolicy: "no-cache"
    });

    if (!data.post) {
      return ctx.html(defaultMetadata, 404);
    }

    const post = data.post as PostFragment;
    const { author, metadata } = post;
    const { usernameWithPrefix } = getAccount(author);
    const filteredContent = getPostData(metadata)?.content || "";
    const title = `${post.__typename} by ${usernameWithPrefix} on Hey`;
    const description = (filteredContent || title).slice(0, 155);
    const postUrl = `https://hey.xyz/posts/${post.slug}`;

    const ogHtml = html`
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>${title}</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Hey" />
          <meta property="og:url" content="https://hey.xyz/posts/${post.slug}" />
          <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
          <meta property="og:image" content="${getAvatar(author, TRANSFORMS.AVATAR_BIG)}" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta property="twitter:image" content="${getAvatar(author, TRANSFORMS.AVATAR_BIG)}" />
          <meta name="twitter:site" content="@heydotxyz" />
          <link rel="canonical" href="https://hey.xyz/posts/${post.slug}" />
        </head>
        <body>
          <h1>${title}</h1>
          <h2>${description}</h2>
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

    const cleanHtml = ogHtml.toString().replace(/\n\s+/g, "").trim();
    await setRedis(cacheKey, cleanHtml);

    return ctx.html(cleanHtml, 200);
  } catch {
    return ctx.html(defaultMetadata, 500);
  }
};

export default getPost;
