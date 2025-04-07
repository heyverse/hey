import cn from "@/helpers/cn";
import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, memo } from "react";

const badgeVariants = cva("rounded-md border text-white text-xs shadow-xs", {
  variants: {
    variant: {
      primary: "border-black bg-black",
      brand: "border-brand-600 bg-brand-500",
      secondary: "border-gray-600 bg-gray-500",
      danger: "border-red-600 bg-red-500",
      warning: "border-yellow-600 bg-yellow-500"
    },
    size: {
      sm: "px-2",
      md: "px-2 py-0.5",
      lg: "px-2.5 py-1"
    }
  },
  defaultVariants: { variant: "primary", size: "sm" }
});

interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
}

export const Badge = memo(
  forwardRef<HTMLDivElement, BadgeProps>(function Badge(
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
  })
);
