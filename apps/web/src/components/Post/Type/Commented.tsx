import ThreadBody from "@/components/Post/ThreadBody";
import type { PostFragment } from "@hey/indexer";

interface CommentedProps {
  commentOn: PostFragment;
}

const Commented = ({ commentOn }: CommentedProps) => {
  return <ThreadBody post={commentOn} />;
};

export default Commented;
