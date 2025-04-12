import cn from "@/helpers/cn";
import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef, memo } from "react";

const buttonVariants = cva("rounded-full font-bold", {
  variants: {
    variant: { primary: "" },
    size: { sm: "px-3 py-0.5 text-sm", md: "px-4 py-1", lg: "px-5 py-1.5" },
    outline: { true: "", false: "" }
  },
  compoundVariants: [
    // Non-outline Primary
    {
      variant: "primary",
      outline: false,
      class: cn(
        "text-white hover:text-white active:text-gray-400",
        "bg-gray-950 hover:bg-gray-700 active:bg-gray-700",
        "border border-gray-950 hover:border-gray-800 active:border-gray-700",
        "dark:text-gray-950 dark:hover:text-gray-900 dark:active:text-gray-600",
        "dark:bg-white dark:hover:bg-gray-200 dark:active:bg-gray-200",
        "dark:border-white dark:hover:border-gray-100 dark:active:border-gray-200",
        "disabled:text-gray-500 disabled:bg-gray-200 disabled:border-gray-200",
        "dark:disabled:text-gray-600 dark:disabled:bg-gray-800 dark:disabled:border-gray-800"
      )
    },
    // Outline Primary
    {
      variant: "primary",
      outline: true,
      class: cn(
        "text-gray-950 active:text-gray-300",
        "border border-gray-300 hover:border-gray-950",
        "dark:text-white dark:active:text-gray-700",
        "dark:border-gray-700 dark:hover:border-gray-100",
        "disabled:text-gray-300 disabled:border-gray-300"
      )
    }
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    outline: false
  }
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  icon?: ReactNode;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      { children, className, disabled, icon, outline, size, variant, ...rest },
      ref
    ) => {
      return (
        <button
          className={cn(buttonVariants({ variant, size, outline, className }), {
            "inline-flex items-center justify-center gap-x-1.5": icon
          })}
          disabled={disabled}
          ref={ref}
          type={rest.type}
          {...rest}
        >
          {icon}
          {children && <div>{children}</div>}
        </button>
      );
    }
  )
);
