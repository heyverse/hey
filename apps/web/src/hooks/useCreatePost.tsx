import { useApolloClient } from "@apollo/client";
import {
  PostDocument,
  type PostFragment,
  useCreatePostMutation,
  usePostLazyQuery
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { hono } from "@/helpers/fetcher";
import useTransactionLifecycle from "./useTransactionLifecycle";
import useWaitForTransactionToComplete from "./useWaitForTransactionToComplete";

interface CreatePostProps {
  commentOn?: PostFragment;
  onCompleted: () => void;
  onError: (error: ApolloClientError) => void;
}

const useCreatePost = ({
  commentOn,
  onCompleted,
  onError
}: CreatePostProps) => {
  const navigate = useNavigate();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
  const [getPost] = usePostLazyQuery();
  const { cache } = useApolloClient();
  const isComment = Boolean(commentOn);

  const updateCache = useCallback(
    async (txHash: string, toastId: string | number) => {
      const { data } = await getPost({
        fetchPolicy: "cache-and-network",
        variables: { request: { txHash } }
      });

      if (!data?.post) {
        return;
      }

      const type = isComment ? "Comment" : "Post";

      try {
        void hono.posts.create({
          slug: data.post.slug,
          type
        });
      } catch {}

      toast.success(`${type} created successfully!`, {
        action: {
          label: "View",
          onClick: () => navigate(`/posts/${data.post?.slug}`)
        },
        id: toastId
      });
      cache.modify({
        fields: {
          [isComment ? "postReferences" : "posts"]: () => {
            cache.writeQuery({ data: data.post, query: PostDocument });
          }
        }
      });
    },
    [getPost, cache, navigate, isComment]
  );

  const onCompletedWithTransaction = useCallback(
    (hash: string) => {
      const toastId = toast.loading(
        `${isComment ? "Comment" : "Post"} processing...`
      );
      waitForTransactionToComplete(hash).then(() => updateCache(hash, toastId));
      return onCompleted();
    },
    [waitForTransactionToComplete, updateCache, onCompleted, isComment]
  );

  // Onchain mutations
  const [createPost] = useCreatePostMutation({
    onCompleted: async ({ post }) => {
      if (post.__typename === "PostResponse") {
        return onCompletedWithTransaction(post.hash);
      }

      return await handleTransactionLifecycle({
        onCompleted: onCompletedWithTransaction,
        onError,
        transactionData: post
      });
    },
    onError
  });

  return { createPost };
};

export default useCreatePost;
