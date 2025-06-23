import { useApolloClient } from "@apollo/client";
import { useDeletePostMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { toast } from "sonner";
import { Alert } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useDeletePostAlertStore } from "@/store/non-persisted/alert/useDeletePostAlertStore";

const DeletePost = () => {
  const { deletingPost, setShowPostDeleteAlert, showPostDeleteAlert } =
    useDeletePostAlertStore();
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.evict({
      id: `${deletingPost?.__typename}:${deletingPost?.id}`
    });
  };

  const onCompleted = () => {
    setShowPostDeleteAlert(false);
    updateCache();
    toast.success("Post deleted");
  };

  const onError = (error: ApolloClientError) => {
    errorToast(error);
  };

  const [deletePost, { loading }] = useDeletePostMutation({
    onCompleted: async ({ deletePost }) => {
      if (deletePost.__typename === "DeletePostResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        onCompleted,
        onError,
        transactionData: deletePost
      });
    }
  });

  const handleDelete = async () => {
    return await deletePost({
      variables: { request: { post: deletingPost?.id } }
    });
  };

  return (
    <Alert
      confirmText="Delete"
      description="This can't be undone and it will be removed from your account, the timeline of any accounts that follow you, and from search results."
      isPerformingAction={loading}
      onClose={() => setShowPostDeleteAlert(false)}
      onConfirm={handleDelete}
      show={showPostDeleteAlert}
      title="Delete Post?"
    />
  );
};

export default DeletePost;
