import type { AnyPostFragment } from "@hey/indexer";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface PostWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  post: AnyPostFragment;
}

const PostWrapper = ({ children, className = "", post }: PostWrapperProps) => {
  const { push } = useRouter();

  const handleClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      push(`/posts/${post.id}`);
    }
  };

  return (
    <article className={className} onClick={handleClick}>
      {children}
    </article>
  );
};

export default PostWrapper;
