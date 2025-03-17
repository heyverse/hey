import getPostOGImages from "@helpers/getPostOGImages";
import { APP_NAME, APP_URL } from "@hey/data/constants";
import getAccount from "@hey/helpers/getAccount";
import getPostData from "@hey/helpers/getPostData";
import { PostDocument, type PostFragment } from "@hey/indexer";
import apolloClient from "@hey/indexer/apollo/client";
import type { Metadata } from "next";
import defaultMetadata from "src/defaultMetadata";

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { id } = await params;

  const { data } = await apolloClient().query({
    query: PostDocument,
    variables: { request: { post: id } }
  });

  if (!data.post) {
    return defaultMetadata;
  }

  const post = data.post as PostFragment;
  const { author, metadata } = post;
  const filteredContent = getPostData(metadata)?.content || "";
  const filteredAsset = getPostData(metadata)?.asset;
  const assetIsAudio = filteredAsset?.type === "Audio";

  const { name, link, usernameWithPrefix } = getAccount(author);
  const title = `${post.__typename} by ${usernameWithPrefix} • ${APP_NAME}`;
  const description = (filteredContent || title).slice(0, 155);

  return {
    alternates: { canonical: `${APP_URL}/posts/${post.id}` },
    applicationName: APP_NAME,
    authors: { name, url: `${APP_URL}${link}` },
    creator: name,
    description: description,
    metadataBase: new URL(`${APP_URL}/posts/${post.id}`),
    openGraph: {
      description: description,
      images: getPostOGImages(metadata) as any,
      siteName: "Hey",
      type: "article",
      url: `${APP_URL}/posts/${post.id}`
    },
    other: {
      "count:collects": post.stats.collects,
      "count:tips": post.stats.tips,
      "count:comments": post.stats.comments,
      "count:likes": post.stats.reactions,
      "count:reposts": post.stats.reposts,
      "count:quotes": post.stats.quotes,
      "lens:id": post.id
    },
    publisher: name,
    title: title,
    twitter: {
      card: assetIsAudio ? "summary" : "summary_large_image",
      site: "@heydotxyz"
    }
  };
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const metadata = await generateMetadata({ params });

  if (!metadata) {
    return <h1>{id}</h1>;
  }

  const postUrl = `${APP_URL}/posts/${metadata.other?.["lens:id"]}`;

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>
            <a href={postUrl}>Collects: {metadata.other?.["count:collects"]}</a>
          </li>
          <li>
            <a href={postUrl}>Tips: {metadata.other?.["count:tips"]}</a>
          </li>
          <li>Comments: {metadata.other?.["count:comments"]}</li>
          <li>
            <a href={postUrl}>Likes: {metadata.other?.["count:likes"]}</a>
          </li>
          <li>
            <a href={postUrl}>Reposts: {metadata.other?.["count:reposts"]}</a>
          </li>
          <li>
            <a href={`${postUrl}/quotes`}>
              Quotes: {metadata.other?.["count:quotes"]}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Page;
