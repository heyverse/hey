import cn from "@/helpers/cn";
import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, memo } from "react";

const badgeVariants = cva("rounded-md border text-white text-xs shadow-xs", {
  variants: {
    variant: { primary: "border-black bg-black" },
    size: { sm: "px-2" }
  },
  defaultVariants: { variant: "primary", size: "sm" }
});

interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { children, className, variant, size, ...rest },
  ref
) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      ref={ref}
      {...rest}
    >
      {children}
    </span>
  );
});

export default memo(Badge);
