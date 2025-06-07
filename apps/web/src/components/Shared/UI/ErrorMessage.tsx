import cn from "@/helpers/cn";
import { memo } from "react";
import { H6 } from "./Typography";

interface ErrorMessageProps {
  className?: string;
  error?: any;
  title?: string;
}

const ErrorMessage = ({ className = "", error, title }: ErrorMessageProps) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className={cn(
        "space-y-1 rounded-xl border-2 border-red-500/50 bg-red-50 p-4 text-red-800 text-sm dark:bg-red-900/10 dark:text-red-200",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {title ? <H6>{title}</H6> : null}
      </div>
      <div className="break-words">{error?.message}</div>
    </div>
  );
};

export default memo(ErrorMessage);
