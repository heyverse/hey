import cn from "@/helpers/cn";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router";

interface TabButtonProps {
  active: boolean;
  badge?: ReactNode;
  className?: string;
  name: string;
  onClick?: () => void;
  showOnSm?: boolean;
  type?: string;
}

const TabButton = ({
  active,
  badge,
  className = "",
  name,
  onClick,
  showOnSm = false,
  type
}: TabButtonProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQuery = (type?: string) => {
    if (!type) {
      return;
    }

    searchParams.set("type", type);
    setSearchParams(searchParams);
  };

  return (
    <button
      aria-label={name}
      className={cn(
        { "bg-gray-300 dark:bg-gray-300/20": active },
        "hover:bg-gray-300 dark:hover:bg-gray-300/30",
        "flex items-center justify-center gap-x-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm",
        className
      )}
      onClick={() => {
        updateQuery(type);
        onClick?.();
      }}
      type="button"
    >
      <span className={cn({ "hidden sm:block": !showOnSm })}>{name}</span>
      {badge}
    </button>
  );
};

export default TabButton;
