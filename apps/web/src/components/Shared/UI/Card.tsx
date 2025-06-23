import { type ElementType, type MouseEvent, memo, type ReactNode } from "react";
import cn from "@/helpers/cn";

interface CardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  forceRounded?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const Card = ({
  as: Tag = "div",
  children,
  className = "",
  forceRounded = false,
  onClick
}: CardProps) => {
  return (
    <Tag
      className={cn(
        forceRounded
          ? "rounded-xl border"
          : "rounded-none border-y md:rounded-xl md:border",
        "border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-black",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default memo(Card);
