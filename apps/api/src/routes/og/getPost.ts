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

  return generateOg({
    buildHtml: (post: PostFragment) => {
      const targetPost =
        (post as any).__typename === "Repost" ? (post as any).repostOf : post;
      const { author, metadata } = targetPost as any;
      const { usernameWithPrefix } = getAccount(author);
      const postData = getPostData(metadata);
      const filteredContent = postData?.content || "";
      const title = `${(targetPost as any).__typename} by ${usernameWithPrefix} on Hey`;
      const description = normalizeDescription(filteredContent, title);
      const postUrl = `https://hey.xyz/posts/${(post as any).slug}`;

      const escTitle = escapeHtml(title);
      const escDescription = escapeHtml(description);

      // Derive attachments to render (max 4 images or 1 video)
      const asset = postData?.asset;
      const attachments = postData?.attachments || [];

      // Prefer a video asset; otherwise if any video attachment exists, use the first one
      const videoToRender =
        asset?.type === "Video"
          ? { poster: asset.cover, uri: asset.uri }
          : (() => {
              const vid = attachments.find((a) => a.type === "Video");
              if (!vid) return null;
              return { poster: (vid as any).coverUri, uri: vid.uri };
            })();

      // Collect image URIs: include primary image asset first, then image attachments; de-dupe and clamp to 4
      const imageUris = (() => {
        if (videoToRender) return [] as string[];
        const list: string[] = [];
        if (asset?.type === "Image" && asset.uri) list.push(asset.uri);
        for (const att of attachments) {
          if (att.type === "Image" && att.uri) list.push(att.uri);
        }
        return Array.from(new Set(list)).slice(0, 4);
      })();

      // OG/Twitter meta for Discord: prefer video poster, else first images, else avatar
      const ogImageCandidates = (() => {
        if (videoToRender?.poster) return [videoToRender.poster];
        if (imageUris.length) return imageUris;
        return [getAvatar(author, TRANSFORMS.AVATAR_BIG)];
      })();
      const ogType = videoToRender ? "video.other" : "article";
      const twitterCard = videoToRender
        ? "player"
        : imageUris.length
          ? "summary_large_image"
          : "summary";
      const guessMime = (url?: string | null) => {
        if (!url) return "video/mp4";
        const u = url.toLowerCase();
        if (u.endsWith(".mp4")) return "video/mp4";
        if (u.endsWith(".webm")) return "video/webm";
        if (u.endsWith(".m3u8")) return "application/x-mpegURL";
        return "video/mp4";
      };

      const ogVideoMeta = videoToRender
        ? html`
            <meta property="og:video" content="${videoToRender.uri}" />
            <meta property="og:video:type" content="${guessMime(videoToRender.uri)}" />
          `
        : html``;

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
            <meta property="og:type" content="${ogType}" />
            <meta property="og:site_name" content="Hey" />
            <meta property="og:url" content="https://hey.xyz/posts/${(post as any).slug}" />
            <meta property="og:logo" content="${STATIC_IMAGES_URL}/app-icon/0.png" />
            ${ogImageCandidates.map((img) => html`<meta property="og:image" content="${img}" />`)}
            ${ogVideoMeta}
            <meta name="twitter:card" content="${twitterCard}" />
            <meta name="twitter:title" content="${escTitle}" />
            <meta name="twitter:description" content="${escDescription}" />
            <meta name="twitter:image" content="${ogImageCandidates[0]}" />
            <meta name="twitter:site" content="@heydotxyz" />
            <link rel="canonical" href="https://hey.xyz/posts/${(post as any).slug}" />
          </head>
          <body>
            <h1>${escTitle}</h1>
            <h2>${escDescription}</h2>
            <div>
              <b>Stats</b>
              <ul>
                <li><a href="${postUrl}">Collects: ${targetPost.stats.collects}</a></li>
                <li><a href="${postUrl}">Tips: ${targetPost.stats.tips}</a></li>
                <li><a href="${postUrl}">Comments: ${targetPost.stats.comments}</a></li>
                <li><a href="${postUrl}">Likes: ${targetPost.stats.reactions}</a></li>
                <li><a href="${postUrl}">Reposts: ${targetPost.stats.reposts}</a></li>
                <li><a href="${postUrl}/quotes">Quotes: ${targetPost.stats.quotes}</a></li>
              </ul>
            </div>
          </body>
        </html>
      `;
    },
    buildJsonLd: (post: PostFragment) => {
      const targetPost =
        (post as any).__typename === "Repost" ? (post as any).repostOf : post;
      const { author, metadata } = targetPost as any;
      const { usernameWithPrefix } = getAccount(author);
      const postData = getPostData(metadata);
      const filteredContent = postData?.content || "";
      const title = `${(targetPost as any).__typename} by ${usernameWithPrefix} on Hey`;
      const description = normalizeDescription(filteredContent, title);

      const asset = postData?.asset;
      const attachments = postData?.attachments || [];
      const video =
        asset?.type === "Video"
          ? { poster: asset.cover, uri: asset.uri }
          : (() => {
              const vid = attachments.find((a) => a.type === "Video");
              if (!vid) return null as null | { poster?: string; uri: string };
              return { poster: (vid as any).coverUri, uri: vid.uri };
            })();
      const images = (() => {
        if (video?.poster) return [video.poster];
        const list: string[] = [];
        if (asset?.type === "Image" && asset.uri) list.push(asset.uri);
        for (const att of attachments) {
          if (att.type === "Image" && att.uri) list.push(att.uri);
        }
        const uniq = Array.from(new Set(list));
        return uniq.length
          ? uniq.slice(0, 4)
          : [getAvatar(author, TRANSFORMS.AVATAR_BIG)];
      })();

      return {
        "@context": "https://schema.org",
        "@id": `https://hey.xyz/posts/${(post as any).slug}`,
        "@type": "Article",
        author: usernameWithPrefix,
        description,
        headline: title,
        image: images,
        ...(video
          ? {
              video: {
                "@type": "VideoObject",
                contentUrl: video.uri,
                ...(video.poster ? { thumbnailUrl: video.poster } : {})
              }
            }
          : {}),
        publisher: { "@type": "Organization", name: "Hey.xyz" },
        url: `https://hey.xyz/posts/${(post as any).slug}`
      } as Record<string, any>;
    },
    ctx,
    extractData: (data) => data.post as PostFragment | null,
    query: PostDocument,
    variables: { request: { post: slug } }
  });
};

export default getPost;
