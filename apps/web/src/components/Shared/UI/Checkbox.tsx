import type { ComponentProps } from "react";
import { forwardRef, memo, useId } from "react";
import cn from "@/helpers/cn";

interface CheckboxProps extends Omit<ComponentProps<"input">, "prefix"> {
  className?: string;
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, ...props }, ref) => {
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

export default memo(Checkbox);
