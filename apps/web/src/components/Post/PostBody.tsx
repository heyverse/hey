import { EyeIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import { getSrc } from "@livepeer/react/external";
import { memo, useMemo } from "react";
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
  const targetPost = useMemo(
    () => (isRepost(post) ? post.repostOf : post),
    [post]
  );
  const { metadata } = targetPost;

  const postData = useMemo(() => getPostData(metadata), [metadata]);
  const filteredContent = postData?.content || "";
  const filteredAttachments = postData?.attachments || [];
  const filteredAsset = postData?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = useMemo(() => getURLs(filteredContent), [filteredContent]);
  const hasURLs = urls.length > 0;

  const processedContent = useMemo(() => {
    let content = filteredContent;

    if (canShowMore) {
      const lines = content?.split("\n");
      if (lines && lines.length > 0) {
        content = lines.slice(0, 5).join("\n");
      }
    }

    return content;
  }, [filteredContent, canShowMore]);

  // Memoize display flags
  const displayFlags = useMemo(() => {
    const showLive = metadata.__typename === "LivestreamMetadata";
    const showAttachments = filteredAttachments.length > 0 || filteredAsset;
    const showSharingLink = metadata.__typename === "LinkMetadata";
    const showOembed =
      !showSharingLink &&
      hasURLs &&
      !showLive &&
      !showAttachments &&
      !quoted &&
      !targetPost.quoteOf;

    return { showAttachments, showLive, showOembed, showSharingLink };
  }, [
    metadata.__typename,
    filteredAttachments.length,
    filteredAsset,
    hasURLs,
    quoted,
    targetPost.quoteOf
  ]);

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
        {processedContent}
      </Markup>
      {canShowMore ? (
        <H6 className="mt-4 flex items-center space-x-1 text-gray-500 dark:text-gray-200">
          <EyeIcon className="size-4" />
          <PostLink post={post}>Show more</PostLink>
        </H6>
      ) : null}
      {/* Attachments and Quotes */}
      {displayFlags.showAttachments ? (
        <Attachments asset={filteredAsset} attachments={filteredAttachments} />
      ) : null}
      {displayFlags.showLive ? (
        <div className="mt-3">
          <Video
            src={getSrc(
              (metadata as any).liveUrl || (metadata as any).playbackUrl
            )}
          />
        </div>
      ) : null}
      {displayFlags.showOembed ? <Oembed url={urls[0]} /> : null}
      {displayFlags.showSharingLink ? (
        <Oembed url={(metadata as any).sharingLink} />
      ) : null}
      {targetPost.quoteOf ? <Quote post={targetPost.quoteOf} /> : null}
    </div>
  );
};

export default memo(PostBody);
