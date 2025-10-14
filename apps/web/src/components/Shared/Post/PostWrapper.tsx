import type { AnyPostFragment } from "@hey/indexer";
import type { ReactNode } from "react";
import { memo, useRef } from "react";
import { useNavigate } from "react-router";
import usePostView from "@/hooks/usePostView";
import { usePostLinkStore } from "@/store/non-persisted/navigation/usePostLinkStore";

interface PostWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  post: AnyPostFragment;
}

const PostWrapper = ({ children, className = "", post }: PostWrapperProps) => {
  const navigate = useNavigate();
  const { setCachedPost } = usePostLinkStore();
  const rootRef = useRef<HTMLElement>(null);
  usePostView({ slug: post.slug });

  const handleClick = () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString().length) {
      setCachedPost(post);
      navigate(`/posts/${post.slug}`);
    }
  };

  return (
    <article className={className} onClick={handleClick} ref={rootRef}>
      {children}
    </article>
  );
};

export default memo(PostWrapper);
