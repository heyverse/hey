import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef, memo, useId } from "react";
import cn from "@/helpers/cn";
import { FieldError } from "./Form";
import HelpTooltip from "./HelpTooltip";

const inputWrapperVariants = cva(
  "flex w-full items-center border border-gray-300 bg-white focus-within:border-gray-500 dark:border-gray-700 dark:bg-gray-900",
  {
    defaultVariants: {
      disabled: false,
      error: false,
      prefix: false
    },
    variants: {
      disabled: {
        false: "",
        true: "!bg-gray-500/20 opacity-50"
      },
      error: {
        false: "",
        true: "!border-red-500"
      },
      prefix: {
        false: "rounded-xl",
        true: "rounded-r-xl"
      }
    }
  }
);

const inputFieldVariants = cva(
  "peer w-full border-none bg-transparent outline-hidden focus:ring-0",
  {
    defaultVariants: { disabled: false, error: false, prefix: false },
    variants: {
      disabled: {
        false: "",
        true: "cursor-not-allowed"
      },
      error: {
        false: "",
        true: "placeholder:text-red-500"
      },
      prefix: {
        false: "rounded-xl",
        true: "rounded-r-xl"
      }
    }
  }
);

interface InputProps
  extends Omit<ComponentProps<"input">, "prefix">,
    Omit<VariantProps<typeof inputWrapperVariants>, "disabled" | "prefix"> {
  className?: string;
  helper?: ReactNode;
  hideError?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  label?: ReactNode;
  prefix?: ReactNode | string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      error,
      helper,
      hideError = false,
      iconLeft,
      iconRight,
      label,
      prefix,
      type = "text",
      ...props
    },
    ref
  ) => {
    const id = useId();

    const iconStyles = [
      "text-zinc-500 [&>*]:peer-focus:text-gray-500 [&>*]:h-5",
      { "!text-red-500 [&>*]:peer-focus:!text-red-500": error }
    ];

    return (
      <label className="w-full" htmlFor={id}>
        {label ? (
          <div className="mb-1 flex items-center space-x-1.5">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {label}
            </div>
            <HelpTooltip>{helper}</HelpTooltip>
          </div>
        ) : null}
        <div className="flex">
          {prefix ? (
            <span className="inline-flex items-center rounded-l-xl border border-gray-300 border-r-0 bg-gray-100 px-3 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              {prefix}
            </span>
          ) : null}
          <div
            className={inputWrapperVariants({
              disabled: props.disabled,
              error,
              prefix: Boolean(prefix)
            })}
          >
            <input
              className={inputFieldVariants({
                className,
                disabled: props.disabled,
                error,
                prefix: Boolean(prefix)
              })}
              id={id}
              ref={ref}
              type={type}
              {...props}
            />
            <span
              className={cn({ "order-first pl-3": iconLeft }, iconStyles)}
              tabIndex={-1}
            >
              {iconLeft}
            </span>
            <span
              className={cn({ "order-last pr-3": iconRight }, iconStyles)}
              tabIndex={-1}
            >
              {iconRight}
            </span>
          </div>
        </div>
        {!hideError && props.name ? <FieldError name={props.name} /> : null}
      </label>
    );
  }
);

export default memo(Input);
