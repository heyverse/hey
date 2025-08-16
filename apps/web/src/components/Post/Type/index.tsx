import type { AnyPostFragment } from "@hey/indexer";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import Commented from "./Commented";
import Reposted from "./Reposted";

interface PostTypeProps {
  post: AnyPostFragment;
  showType: boolean;
}

const PostType = ({ post, showType }: PostTypeProps) => {
  const type = post.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>
      {type === "Repost" ? <Reposted account={post.author} /> : null}
      {type === "Post" && post.commentOn ? (
        <Commented commentOn={post.commentOn} />
      ) : null}
    </span>
  );
};

export default PostType;
