import Attachments from "@/components/Shared/Attachments";
import Quote from "@/components/Shared/Embed/Quote";
import Markup from "@/components/Shared/Markup";
import Oembed from "@/components/Shared/Oembed";
import { H6 } from "@/components/Shared/UI";
import Video from "@/components/Shared/Video";
import cn from "@/helpers/cn";
import { EyeIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import getURLs from "@hey/helpers/getURLs";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import { getSrc } from "@livepeer/react/external";
import { memo } from "react";
import { Link } from "react-router";
import Metadata from "./Metadata";

interface PostBodyProps {
  contentClassName?: string;
  post: AnyPostFragment;
  quoted?: boolean;
  showMore?: boolean;
}

const PostBody = ({
  contentClassName = "",
  post,
  quoted = false,
  showMore = false
}: PostBodyProps) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
  const { slug, metadata } = targetPost;

  const filteredContent = getPostData(metadata)?.content || "";
  const filteredAttachments = getPostData(metadata)?.attachments || [];
  const filteredAsset = getPostData(metadata)?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = getURLs(filteredContent);
  const hasURLs = urls.length > 0;

  let content = filteredContent;

  if (canShowMore) {
    const truncatedContent = content?.split("\n")?.[0];
    if (truncatedContent) {
      content = truncatedContent;
    }
  }

  // Show live if it's there
  const showLive = metadata.__typename === "LivestreamMetadata";
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
  // Show sharing link
  const showSharingLink = metadata.__typename === "LinkMetadata";
  const showOembed =
    !showSharingLink &&
    hasURLs &&
    !showLive &&
    !showAttachments &&
    !quoted &&
    !targetPost.quoteOf;

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { "line-clamp-5": canShowMore },
          "markup linkify break-words",
          contentClassName
        )}
        mentions={targetPost.mentions}
      >
        {content}
      </Markup>
      {canShowMore ? (
        <H6 className="mt-4 flex items-center space-x-1 text-gray-500 dark:text-gray-200">
          <EyeIcon className="size-4" />
          <Link to={`/posts/${slug}`}>Show more</Link>
        </H6>
      ) : null}
      {/* Attachments and Quotes */}
      {showAttachments ? (
        <Attachments asset={filteredAsset} attachments={filteredAttachments} />
      ) : null}
      {showLive ? (
        <div className="mt-3">
          <Video src={getSrc(metadata.liveUrl || metadata.playbackUrl)} />
        </div>
      ) : null}
      {showOembed ? <Oembed url={urls[0]} /> : null}
      {showSharingLink ? <Oembed url={metadata.sharingLink} /> : null}
      {targetPost.quoteOf ? <Quote post={targetPost.quoteOf} /> : null}
      <Metadata metadata={targetPost.metadata} />
    </div>
  );
};

export default memo(PostBody);
