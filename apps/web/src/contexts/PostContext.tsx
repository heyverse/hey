import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment, TimelineItemFragment } from "@hey/indexer";
import { createContext, type ReactNode, useContext, useMemo } from "react";

export interface PostContextValue {
  post: AnyPostFragment;
  timelineItem?: TimelineItemFragment;
  targetPost: AnyPostFragment;
  rootPost: AnyPostFragment;
  canAct: boolean;
  isRepost: boolean;
  hasActions: boolean;
  postId: string;
  authorAddress: string;
}

const PostContext = createContext<PostContextValue | null>(null);

interface PostProviderProps {
  post: AnyPostFragment;
  timelineItem?: TimelineItemFragment;
  children: ReactNode;
}

export const PostProvider = ({
  post,
  timelineItem,
  children
}: PostProviderProps) => {
  const contextValue = useMemo(() => {
    const targetPost = isRepost(post) ? post.repostOf : post;
    const rootPost = timelineItem ? timelineItem.primary : post;

    return {
      authorAddress: post.author.address,
      canAct: Boolean(targetPost.actions?.length),
      hasActions: Boolean(targetPost.actions?.length),
      isRepost: isRepost(post),
      post,
      postId: post.id,
      rootPost,
      targetPost,
      timelineItem
    };
  }, [post, timelineItem]);

  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};

export const usePostContextSafe = () => {
  return useContext(PostContext);
};
