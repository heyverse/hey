import SinglePost from "@/components/Post/SinglePost";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { AccountFeedType } from "@hey/data/enums";
import {
  PageSize,
  PostType,
  type PostsRequest,
  usePostsQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { WindowVirtualizer } from "virtua";

interface AccountFeedProps {
  username: string;
  accountDetailsLoading: boolean;
  address: string;
  type:
    | AccountFeedType.Collects
    | AccountFeedType.Feed
    | AccountFeedType.Media
    | AccountFeedType.Replies;
}

const AccountFeed = ({
  username,
  accountDetailsLoading,
  address,
  type
}: AccountFeedProps) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

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

  const request: PostsRequest = {
    pageSize: PageSize.Fifty,
    filter: {
      postTypes,
      ...(type === AccountFeedType.Collects
        ? { collectedBy: { account: address } }
        : { authors: [address] })
    }
  };

  const { data, error, fetchMore, loading } = usePostsQuery({
    skip: !address,
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

  if (loading || accountDetailsLoading) {
    return <PostsShimmer />;
  }

  if (!posts?.length) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message={
          <div>
            <b className="mr-1">{username}</b>
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
    <Card className="virtual-divider-list-window">
      <WindowVirtualizer>
        {posts.map((post, index) => (
          <SinglePost
            key={post.id}
            isFirst={index === 0}
            isLast={index === (posts?.length || 0) - 1}
            post={post}
          />
        ))}
        {hasMore && <span ref={ref} />}
      </WindowVirtualizer>
    </Card>
  );
};

export default AccountFeed;
