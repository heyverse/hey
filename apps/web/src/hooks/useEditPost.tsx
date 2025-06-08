import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import { useApolloClient } from "@apollo/client";
import { useEditPostMutation, usePostLazyQuery } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback } from "react";
import { toast } from "sonner";
import useTransactionLifecycle from "./useTransactionLifecycle";
import useWaitForTransactionToComplete from "./useWaitForTransactionToComplete";

interface EditPostProps {
  onCompleted: () => void;
  onError: (error: ApolloClientError) => void;
}

const useEditPost = ({ onCompleted, onError }: EditPostProps) => {
  const handleTransactionLifecycle = useTransactionLifecycle();
  const { editingPost, setEditingPost } = usePostStore();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
  const [getPost] = usePostLazyQuery();
  const { cache } = useApolloClient();

  const updateCache = useCallback(
    async (toastId: string | number) => {
      const { data } = await getPost({
        variables: { request: { post: editingPost?.id } },
        fetchPolicy: "cache-and-network"
      });

      if (!data?.post) {
        return;
      }

      setEditingPost(undefined);
      toast.success("Post edited successfully!", { id: toastId });
      cache.modify({
        fields: { post: () => data.post },
        id: cache.identify(data.post)
      });
    },
    [getPost, cache, editingPost]
  );

  const onCompletedWithTransaction = useCallback(
    (hash: string) => {
      const toastId = toast.loading("Editing post...");
      waitForTransactionToComplete(hash).then(() => updateCache(toastId));
      return onCompleted();
    },
    [waitForTransactionToComplete, updateCache, onCompleted]
  );

  // Onchain mutations
  const [editPost] = useEditPostMutation({
    onCompleted: async ({ editPost }) => {
      if (editPost.__typename === "PostResponse") {
        return onCompletedWithTransaction(editPost.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: editPost,
        onCompleted: onCompletedWithTransaction,
        onError
      });
    },
    onError
  });

  return { editPost };
};

export default useEditPost;
