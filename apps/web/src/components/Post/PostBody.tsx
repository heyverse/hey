import { EyeIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import { getSrc } from "@livepeer/react/external";
import { memo } from "react";
import Quote from "@/components/Shared/Embed/Quote";
import Markup from "@/components/Shared/Markup";
import Attachments from "@/components/Shared/Post/Attachments";
import Oembed from "@/components/Shared/Post/Oembed";
import PostLink from "@/components/Shared/Post/PostLink";
import Video from "@/components/Shared/Post/Video";
import { H6 } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import getURLs from "@/helpers/getURLs";

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
  const { metadata } = targetPost;

  const filteredContent = getPostData(metadata)?.content || "";
  const filteredAttachments = getPostData(metadata)?.attachments || [];
  const filteredAsset = getPostData(metadata)?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = getURLs(filteredContent);
  const hasURLs = urls.length > 0;

  let content = filteredContent;

  if (canShowMore) {
    const lines = content?.split("\n");
    if (lines && lines.length > 0) {
      content = lines.slice(0, 5).join("\n");
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
          <PostLink post={post}>Show more</PostLink>
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
    </div>
  );
};

export default memo(PostBody);
