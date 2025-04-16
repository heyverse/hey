import cn from "@/helpers/cn";
import { type VariantProps, cva } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef, memo } from "react";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "rounded-full font-bold inline-flex items-center justify-center relative overflow-hidden",
  {
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
          "text-white hover:text-white active:text-gray-100",
          "bg-gray-950 hover:bg-gray-800 active:bg-gray-700",
          "border border-gray-950 hover:border-gray-800 active:border-gray-700",
          "dark:text-gray-950 dark:hover:text-gray-900 dark:active:text-gray-600",
          "dark:bg-white dark:hover:bg-gray-200 dark:active:bg-gray-200",
          "dark:border-white dark:hover:border-gray-100 dark:active:border-gray-200"
        )
      },
      // Outline Primary
      {
        variant: "primary",
        outline: true,
        class: cn(
          "text-gray-950 active:text-gray-500",
          "border border-gray-300 hover:border-gray-400",
          "dark:text-white dark:active:text-gray-700",
          "dark:border-gray-700 dark:hover:border-gray-600"
        )
      }
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      outline: false
    }
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        className,
        disabled,
        icon,
        outline,
        size,
        variant,
        loading,
        ...rest
      },
      ref
    ) => {
      return (
        <button
          className={buttonVariants({ variant, size, outline, className })}
          disabled={disabled}
          ref={ref}
          type={rest.type}
          {...rest}
        >
          <AnimatePresence mode="wait">
            <motion.div
              className="flex items-center gap-x-1.5"
              initial="idle"
              animate={loading ? "loading" : "idle"}
              variants={{
                idle: { opacity: 1, y: 0 },
                loading: { opacity: 0, y: -20 }
              }}
              transition={{ type: "spring", duration: 0.2, bounce: 0 }}
            >
              {icon}
              {children}
            </motion.div>
            {loading && (
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.2, bounce: 0 }}
              >
                <Spinner size="xs" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      );
    }
  )
);
