import { BookmarkIcon } from "@heroicons/react/24/outline";
import { memo } from "react";
import cn from "@/helpers/cn";

interface BookmarksProps {
  className?: string;
}

const Bookmarks = ({ className = "" }: BookmarksProps) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <BookmarkIcon className="size-4" />
      <div>Bookmarks</div>
    </div>
  );
};

export default memo(Bookmarks);
