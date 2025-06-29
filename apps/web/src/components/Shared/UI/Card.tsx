import { cva, type VariantProps } from "class-variance-authority";
import { type ElementType, type MouseEvent, memo, type ReactNode } from "react";

const cardVariants = cva(
  "border-gray-200 dark:border-gray-700 bg-white dark:bg-black",
  {
    defaultVariants: { forceRounded: false },
    variants: {
      forceRounded: {
        false: "rounded-none border-y md:rounded-xl md:border",
        true: "rounded-xl border"
      }
    }
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  as?: ElementType;
  children: ReactNode;
  className?: string;
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
      className={cardVariants({ className, forceRounded })}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};

export default memo(Card);
