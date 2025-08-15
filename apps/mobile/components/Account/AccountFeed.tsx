import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { AccountFeedType } from "@hey/data/enums";
import {
  type AnyPostFragment,
  MainContentFocus,
  PageSize,
  type PostsRequest,
  PostType,
  usePostsQuery
} from "@hey/indexer";
import { useCallback, useMemo } from "react";
import PostFeed from "../Shared/PostFeed";
import SinglePost from "../Shared/SinglePost";

interface AccountFeedProps {
  username: string;
  address: string;
  type:
    | AccountFeedType.Collects
    | AccountFeedType.Feed
    | AccountFeedType.Media
    | AccountFeedType.Replies;
}

const EMPTY_MESSAGES: Record<AccountFeedType, string> = {
  [AccountFeedType.Feed]: "has nothing in their feed yet!",
  [AccountFeedType.Media]: "has no media yet!",
  [AccountFeedType.Replies]: "hasn't replied yet!",
  [AccountFeedType.Collects]: "hasn't collected anything yet!"
};

const AccountFeed = ({ username, address, type }: AccountFeedProps) => {
  const postTypes = useMemo(() => {
    switch (type) {
      case AccountFeedType.Feed:
        return [PostType.Root, PostType.Repost, PostType.Quote];
      case AccountFeedType.Replies:
        return [PostType.Comment];
      case AccountFeedType.Media:
        return [PostType.Root, PostType.Quote];
      default:
        return [
          PostType.Root,
          PostType.Comment,
          PostType.Repost,
          PostType.Quote
        ];
    }
  }, [type]);

  const getEmptyMessage = () => {
    return EMPTY_MESSAGES[type] || "";
  };

  const request = useMemo<PostsRequest>(
    () => ({
      filter: {
        postTypes,
        ...(type === AccountFeedType.Media && {
          metadata: {
            mainContentFocus: [
              MainContentFocus.Image,
              MainContentFocus.Audio,
              MainContentFocus.Video,
              MainContentFocus.ShortVideo
            ]
          }
        }),
        ...(type === AccountFeedType.Collects
          ? { collectedBy: { account: address } }
          : { authors: [address] })
      },
      pageSize: PageSize.Fifty
    }),
    [address, postTypes, type]
  );

  const { data, error, fetchMore, loading } = usePostsQuery({
    skip: !address,
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
  const hasMore = pageInfo?.next;

  const safePosts = (posts ?? []) as AnyPostFragment[];

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  return (
    <PostFeed
      emptyIcon={<ChatBubbleBottomCenterIcon className="size-8" />}
      emptyMessage={
        <div>
          <b className="mr-1">{username}</b>
          <span>{getEmptyMessage()}</span>
        </div>
      }
      error={error}
      errorTitle="Failed to load account feed"
      handleEndReached={handleEndReached}
      hasMore={hasMore}
      items={safePosts}
      loading={loading}
      renderItem={(post) => <SinglePost post={post} />}
    />
  );
};

export default AccountFeed;
