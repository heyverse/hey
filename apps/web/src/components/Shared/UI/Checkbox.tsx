import cn from "@/helpers/cn";
import type { ComponentProps } from "react";
import { forwardRef, useId } from "react";

interface CheckboxProps extends Omit<ComponentProps<"input">, "prefix"> {
  className?: string;
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className = "", label, ...props }, ref) {
    const id = useId();

    return (
      <div className="flex items-center">
        <input
          className={cn(
            "outline-0 focus:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "mr-2 cursor-pointer rounded transition duration-200 dark:text-gray-500",
            className
          )}
          id={id}
          ref={ref}
          type="checkbox"
          {...props}
        />
        <label
          className="inline-block cursor-pointer whitespace-nowrap"
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    );
  }
);
