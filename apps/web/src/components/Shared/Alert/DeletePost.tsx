import { Alert } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useDeletePostAlertStore } from "@/store/non-persisted/alert/useDeletePostAlertStore";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useApolloClient } from "@apollo/client";
import { Errors } from "@hey/data/errors";
import { useDeletePostMutation } from "@hey/indexer";
import { toast } from "sonner";

const DeletePost = () => {
  const { deletingPost, setShowPostDeleteAlert, showPostDeleteAlert } =
    useDeletePostAlertStore();
  const { isSuspended } = useAccountStatus();
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

  const onError = (error: Error) => {
    errorToast(error);
  };

  const [deletePost, { loading }] = useDeletePostMutation({
    onCompleted: async ({ deletePost }) => {
      if (deletePost.__typename === "DeletePostResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: deletePost,
        onCompleted,
        onError
      });
    }
  });

  const deletePublication = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    return await deletePost({
      variables: { request: { post: deletingPost?.id } }
    });
  };

  return (
    <Alert
      confirmText="Delete"
      description="This can't be undone and it will be removed from your account, the timeline of any accounts that follow you, and from search results."
      isDestructive
      isPerformingAction={loading}
      onClose={() => setShowPostDeleteAlert(false)}
      onConfirm={deletePublication}
      show={showPostDeleteAlert}
      title="Delete Publication?"
    />
  );
};

export default DeletePost;
