import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { AccountFeedType } from "@hey/data/enums";
import {
  MainContentFocus,
  PageSize,
  PostType,
  type PostsRequest,
  usePostsQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useAccountFeedStore } from "src/store/non-persisted/useAccountFeedStore";

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface AccountFeedProps {
  handle: string;
  accountDetailsLoading: boolean;
  address: string;
  type:
    | AccountFeedType.Collects
    | AccountFeedType.Feed
    | AccountFeedType.Media
    | AccountFeedType.Replies;
}

const AccountFeed: FC<AccountFeedProps> = ({
  handle,
  accountDetailsLoading,
  address,
  type
}) => {
  const { mediaFeedFilters } = useAccountFeedStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
  }, [address, handle]);

  const getMediaFilters = () => {
    return Object.entries(mediaFeedFilters)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "images":
            return MainContentFocus.Image;
          case "video":
            return MainContentFocus.Video;
          case "audio":
            return MainContentFocus.Audio;
          default:
            return null;
        }
      })
      .filter(Boolean) as MainContentFocus[];
  };

  const getPostTypes = () => {
    switch (type) {
      case AccountFeedType.Feed:
        return [PostType.Root, PostType.Repost, PostType.Quote];
      case AccountFeedType.Replies:
        return [PostType.Comment];
      case AccountFeedType.Media:
        return [PostType.Root, PostType.Comment, PostType.Quote];
      default:
        return [
          PostType.Root,
          PostType.Comment,
          PostType.Repost,
          PostType.Quote
        ];
    }
  };

  const getEmptyMessage = () => {
    const messages = {
      [AccountFeedType.Feed]: "has nothing in their feed yet!",
      [AccountFeedType.Media]: "has no media yet!",
      [AccountFeedType.Replies]: "hasn't replied yet!",
      [AccountFeedType.Collects]: "hasn't collected anything yet!"
    };
    return messages[type] || "";
  };

  const postTypes = getPostTypes();
  const metadata =
    type === AccountFeedType.Media
      ? { mainContentFocus: getMediaFilters() }
      : null;

  const request: PostsRequest = {
    pageSize: PageSize.Fifty,
    filter: { metadata, postTypes, authors: [address] }
  };

  const { data, error, fetchMore, loading } = usePostsQuery({
    skip: !address,
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
  const hasMore = pageInfo?.next;

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling) {
      virtuoso?.current?.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading || accountDetailsLoading) {
    return <PostsShimmer />;
  }

  if (posts?.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message={
          <div>
            <b className="mr-1">{handle}</b>
            <span>{getEmptyMessage()}</span>
          </div>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load account feed" />;
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        data={posts}
        endReached={onEndReached}
        isScrolling={onScrolling}
        itemContent={(index, post) => (
          <SinglePost
            isFirst={index === 0}
            isLast={index === (posts?.length || 0) - 1}
            post={post}
            showThread={
              type !== AccountFeedType.Media &&
              type !== AccountFeedType.Collects
            }
          />
        )}
        ref={virtuoso}
        restoreStateFrom={
          virtuosoState.ranges.length === 0
            ? virtuosoState?.current?.getState((state: StateSnapshot) => state)
            : virtuosoState
        }
        useWindowScroll
      />
    </Card>
  );
};

export default AccountFeed;
