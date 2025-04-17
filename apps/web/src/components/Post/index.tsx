import CommentFeed from "@/components/Comment/CommentFeed";
import NewPublication from "@/components/Composer/NewPublication";
import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import BackButton from "@/components/Shared/BackButton";
import Footer from "@/components/Shared/Footer";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader, WarningMessage } from "@/components/Shared/UI";
import { usePostLinkStore } from "@/store/non-persisted/navigation/usePostLinkStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import getAccount from "@hey/helpers/getAccount";
import { isRepost } from "@hey/helpers/postHelpers";
import {
  PageSize,
  PostReferenceType,
  PostVisibilityFilter,
  useHiddenCommentsQuery,
  usePostQuery
} from "@hey/indexer";
import { useLocation, useParams } from "react-router";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import NoneRelevantFeed from "../Comment/NoneRelevantFeed";
import FullPost from "./FullPost";
import Quotes from "./Quotes";
import RelevantPeople from "./RelevantPeople";
import PostPageShimmer from "./Shimmer";

interface HiddenCommentFeedState {
  setShowHiddenComments: (show: boolean) => void;
  showHiddenComments: boolean;
}

const store = create<HiddenCommentFeedState>((set) => ({
  setShowHiddenComments: (show) => set({ showHiddenComments: show }),
  showHiddenComments: false
}));

export const useHiddenCommentFeedStore = createTrackedSelector(store);

const ViewPost = () => {
  const { pathname } = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const { currentAccount } = useAccountStore();
  const { cachedPost, setCachedPost } = usePostLinkStore();

  const showQuotes = pathname === `/posts/${slug}/quotes`;

  const { data, error, loading } = usePostQuery({
    skip: !slug,
    variables: { request: { post: slug } },
    onCompleted: (data) => {
      if (data?.post) {
        setCachedPost(null);
      }
    }
  });

  const { data: comments } = useHiddenCommentsQuery({
    skip: !slug,
    variables: {
      request: {
        pageSize: PageSize.Ten,
        referencedPost: slug,
        visibilityFilter: PostVisibilityFilter.Hidden,
        referenceTypes: [PostReferenceType.CommentOn]
      }
    }
  });

  const post = data?.post ?? cachedPost;
  const hasHiddenComments = (comments?.postReferences.items.length || 0) > 0;

  if (!slug || (loading && !cachedPost)) {
    return <PostPageShimmer postList={showQuotes} />;
  }

  if (!post) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const targetPost = isRepost(post) ? post.repostOf : post;
  const canComment =
    targetPost.operations?.canComment.__typename ===
    "PostOperationValidationPassed";

  return (
    <PageLayout
      title={`${targetPost.__typename} by ${
        getAccount(targetPost.author).usernameWithPrefix
      } • Hey`}
      sidebar={
        <div className="space-y-5">
          <Card as="aside" className="p-5">
            <SingleAccount
              hideFollowButton={
                currentAccount?.address === targetPost.author.address
              }
              hideUnfollowButton={
                currentAccount?.address === targetPost.author.address
              }
              account={targetPost.author}
              showBio
            />
          </Card>
          <RelevantPeople mentions={targetPost.mentions} />
          <Footer />
        </div>
      }
      zeroTopMargin
    >
      <div className="space-y-5">
        {showQuotes ? (
          <Quotes post={targetPost} />
        ) : (
          <>
            <Card>
              <CardHeader icon={<BackButton />} title="Post" />
              <FullPost
                hasHiddenComments={hasHiddenComments}
                key={post?.id}
                post={post}
              />
            </Card>
            {currentAccount && !canComment && (
              <WarningMessage
                title="You cannot comment on this post"
                message="You don't have permission to comment on this post."
              />
            )}
            {currentAccount && !post.isDeleted && canComment ? (
              <NewPublication
                post={targetPost}
                feed={targetPost.feed.address}
              />
            ) : null}
            {post.isDeleted ? null : (
              <>
                <CommentFeed postId={targetPost.id} />
                <NoneRelevantFeed postId={targetPost.id} />
              </>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ViewPost;
