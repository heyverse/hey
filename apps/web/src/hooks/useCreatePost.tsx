import { useApolloClient } from "@apollo/client";
import {
  PostDocument,
  type PostFragment,
  useCreatePostMutation,
  usePostLazyQuery
} from "@hey/indexer";
import { toast } from "sonner";
import usePollTransactionStatus from "./usePollTransactionStatus";
import useTransactionLifecycle from "./useTransactionLifecycle";

interface CreatePostProps {
  commentOn?: PostFragment;
  onCompleted: () => void;
  onError: (error: Error) => void;
}

const useCreatePost = ({
  commentOn,
  onCompleted,
  onError
}: CreatePostProps) => {
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();
  const [getPost] = usePostLazyQuery();
  const { cache } = useApolloClient();
  const isComment = Boolean(commentOn);

  const updateCache = async (txHash: string) => {
    const { data } = await getPost({ variables: { request: { txHash } } });
    if (!data?.post) {
      return;
    }

    toast.success(`${isComment ? "Comment" : "Post"} created successfully!`);
    cache.modify({
      fields: {
        [isComment ? "postReferences" : "posts"]: () => {
          cache.writeQuery({ data: data.post, query: PostDocument });
        }
      }
    });
  };

  const onCompletedWithTransaction = (hash: string) => {
    pollTransactionStatus(hash, () => updateCache(hash));
    return onCompleted();
  };

  // Onchain mutations
  const [createPost] = useCreatePostMutation({
    onCompleted: async ({ post }) => {
      if (post.__typename === "PostResponse") {
        return onCompletedWithTransaction(post.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: post,
        onCompleted: onCompletedWithTransaction,
        onError
      });
    },
    onError
  });

  return { createPost };
};

export default useCreatePost;
