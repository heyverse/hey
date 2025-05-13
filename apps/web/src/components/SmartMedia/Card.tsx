import cn from "@/helpers/cn";
import { type ElementType, type MouseEvent, type ReactNode, memo } from "react";

interface CardProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  forceRounded?: boolean;
  withGlow?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const SmartMediaCard = ({
  as: Tag = "div",
  children,
  className = "",
  forceRounded = false,
  withGlow = false,
  onClick
}: CardProps) => {
  const outerRoundedClasses = forceRounded
    ? "rounded-xl"
    : "rounded-none md:rounded-xl";

  // Assuming rounded-xl is 0.75rem (12px), inner radius is 11px.
  // For md:rounded-xl, inner is md:rounded-[11px].
  const innerRoundedClasses = forceRounded
    ? "rounded-[11px]"
    : "rounded-none md:rounded-[11px]";

  const outerDivStyle: React.CSSProperties = {
    background:
      "linear-gradient(90deg, #B8D9C5, #4D7F79, #5BE39D, #9DC4D5, #C6FFD9, #B8D9C5)"
  };

  const innerTagStyle: React.CSSProperties = {};

  if (withGlow) {
    innerTagStyle.boxShadow = "inset 0 0 16px rgba(91, 227, 157, 0.6)";
  }

  return (
    <div
      className={cn("p-[1px]", outerRoundedClasses)}
      style={outerDivStyle}
      onClick={onClick}
    >
      <Tag
        className={cn(
          "h-full w-full bg-white dark:bg-black",
          innerRoundedClasses,
          className
        )}
        style={innerTagStyle}
      >
        {children}
      </Tag>
    </div>
  );
};

export default memo(SmartMediaCard);
