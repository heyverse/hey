import type { AnyPostFragment } from "@hey/indexer";
import type { ReactNode } from "react";
import { memo, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { hono } from "@/helpers/fetcher";
import { usePostLinkStore } from "@/store/non-persisted/navigation/usePostLinkStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface PostWrapperProps {
  children: ReactNode | ReactNode[];
  className?: string;
  post: AnyPostFragment;
}

const PostWrapper = ({ children, className = "", post }: PostWrapperProps) => {
  const navigate = useNavigate();
  const { setCachedPost } = usePostLinkStore();
  const { currentAccount } = useAccountStore();
  const rootRef = useRef<HTMLElement>(null);
  const hasLoggedRef = useRef(false);

  const handleClick = () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString().length) {
      setCachedPost(post);
      navigate(`/posts/${post.slug}`);
    }
  };

  useEffect(() => {
    if (!rootRef.current || hasLoggedRef.current) return;
    const el = rootRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasLoggedRef.current) {
          hasLoggedRef.current = true;
          try {
            void hono.impressions.create({
              address: currentAccount?.address,
              post: post.slug
            });
          } catch {}
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentAccount?.address, post.slug]);

  return (
    <article className={className} onClick={handleClick} ref={rootRef}>
      {children}
    </article>
  );
};

export default memo(PostWrapper);
