import SinglePost from "@/components/Post/SinglePost";
import PostFeed from "@/components/Shared/Post/PostFeed";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { AccountFeedType } from "@hey/data/enums";
import {
  MainContentFocus,
  PageSize,
  PostType,
  type PostsRequest,
  usePostsQuery
} from "@hey/indexer";

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
  const getPostTypes = () => {
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
  };

  const getEmptyMessage = () => {
    return EMPTY_MESSAGES[type] || "";
  };

  const postTypes = getPostTypes();

  const request: PostsRequest = {
    pageSize: PageSize.Fifty,
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

  return (
    <PostFeed
      items={posts ?? []}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onEndReached={onEndReached}
      emptyIcon={<ChatBubbleBottomCenterIcon className="size-8" />}
      emptyMessage={
        <div>
          <b className="mr-1">{username}</b>
          <span>{getEmptyMessage()}</span>
        </div>
      }
      errorTitle="Failed to load account feed"
      renderItem={(post) => <SinglePost key={post.id} post={post} />}
    />
  );
};

export default AccountFeed;
