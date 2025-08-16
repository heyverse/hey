import type { ApolloCache, NormalizedCacheObject } from "@apollo/client";
import { MenuItem } from "@headlessui/react";
import { BookmarkIcon as BookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import {
  type PostFragment,
  useBookmarkPostMutation,
  useUndoBookmarkPostMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import stopEventPropagation from "@/helpers/stopEventPropagation";

interface BookmarkProps {
  post: PostFragment;
}

const Bookmark = ({ post }: BookmarkProps) => {
  const { pathname } = useLocation();
  const hasBookmarked = post.operations?.hasBookmarked;

  const updateCache = (
    cache: ApolloCache<NormalizedCacheObject>,
    hasBookmarked: boolean
  ) => {
    if (!post.operations) {
      return;
    }

    cache.modify({
      fields: { hasBookmarked: () => hasBookmarked },
      id: cache.identify(post.operations)
    });

    cache.modify({
      fields: {
        stats: (existingData) => ({
          ...existingData,
          bookmarks: hasBookmarked
            ? existingData.bookmarks + 1
            : existingData.bookmarks - 1
        })
      },
      id: cache.identify(post)
    });

    // Remove bookmarked post from bookmarks feed
    if (pathname === "/bookmarks") {
      cache.evict({ id: cache.identify(post) });
    }
  };

  const onError = useCallback((error: ApolloClientError) => {
    errorToast(error);
  }, []);

  const [bookmarkPost] = useBookmarkPostMutation({
    onCompleted: () => toast.success("Post bookmarked!"),
    onError,
    update: (cache) => updateCache(cache, true),
    variables: { request: { post: post.id } }
  });

  const [undoBookmarkPost] = useUndoBookmarkPostMutation({
    onCompleted: () => toast.success("Removed post bookmark!"),
    onError,
    update: (cache) => updateCache(cache, false),
    variables: { request: { post: post.id } }
  });

  const handleToggleBookmark = async () => {
    if (hasBookmarked) {
      return await undoBookmarkPost();
    }

    return await bookmarkPost();
  };

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        handleToggleBookmark();
      }}
    >
      <div className="flex items-center space-x-2">
        {hasBookmarked ? (
          <>
            <BookmarkIconSolid className="size-4" />
            <div>Remove Bookmark</div>
          </>
        ) : (
          <>
            <BookmarkIconOutline className="size-4" />
            <div>Bookmark</div>
          </>
        )}
      </div>
    </MenuItem>
  );
};

export default Bookmark;
