import { usePostLinkStore } from "@/store/non-persisted/navigation/usePostLinkStore";
import type { AnyPostFragment } from "@hey/indexer";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";

interface PostLinkProps extends Omit<ComponentProps<typeof Link>, "to"> {
  post: AnyPostFragment;
  children: ReactNode;
}

const PostLink = ({ post, children, onClick, ...props }: PostLinkProps) => {
  const { setCachedPost } = usePostLinkStore();

  return (
    <Link
      to={`/posts/${post.slug}`}
      {...props}
      onClick={(e) => {
        setCachedPost(post);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
};

export default PostLink;
