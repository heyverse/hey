import cn from "@/helpers/cn";
import { type VariantProps, cva } from "class-variance-authority";
import { memo } from "react";

const spinnerVariants = cva("animate-spin rounded-full", {
  variants: {
    variant: {
      primary: "border-gray-200 border-t-gray-600",
      danger: "border-red-200 border-t-red-600",
      warning: "border-yellow-200 border-t-yellow-600"
    },
    size: {
      xs: "size-4 border-[2px]",
      sm: "size-5 border-2",
      md: "size-8 border-[3px]",
      lg: "size-10 border-4"
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "md"
  }
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner = memo(({ className, size, variant }: SpinnerProps) => {
  return <div className={cn(spinnerVariants({ variant, size }), className)} />;
});
