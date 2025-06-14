import cn from "@/helpers/cn";
import type { ComponentProps } from "react";
import { forwardRef, memo, useId } from "react";
import { FieldError } from "./Form";

interface TextAreaProps extends ComponentProps<"textarea"> {
  label?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, ...props }, ref) => {
    const id = useId();

    return (
      <label htmlFor={id} className="w-full">
        {label ? <div className="label">{label}</div> : null}
        <textarea
          className={cn(
            "w-full rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-xs",
            "focus:border-gray-500 focus:ring-0",
            "disabled:bg-gray-500/20 disabled:opacity-60",
            "dark:border-gray-700 dark:bg-gray-900"
          )}
          id={id}
          ref={ref}
          {...props}
        />
        {props.name ? <FieldError name={props.name} /> : null}
      </label>
    );
  }
);

export default memo(TextArea);
