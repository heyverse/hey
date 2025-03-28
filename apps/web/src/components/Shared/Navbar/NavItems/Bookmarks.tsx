import cn from "@/helpers/cn";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface BookmarksProps {
  className?: string;
  onClick?: () => void;
}

const Bookmarks = ({ className = "", onClick }: BookmarksProps) => {
  return (
    <Link
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      href="/bookmarks"
      onClick={onClick}
    >
      <BookmarkIcon className="size-4" />
      <div>Bookmarks</div>
    </Link>
  );
};

export default Bookmarks;
