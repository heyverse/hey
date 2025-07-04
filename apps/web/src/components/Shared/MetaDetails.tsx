import type { ReactNode } from "react";
import { H6 } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

interface MetaDetailsProps {
  children: ReactNode;
  icon: ReactNode;
  noFlex?: boolean;
  title?: string;
  value?: string;
}

const MetaDetails = ({
  children,
  icon,
  noFlex = false,
  title,
  value
}: MetaDetailsProps) => {
  const handleClick = useCopyToClipboard(value ?? "", "Copied to clipboard!");

  return (
    <div
      className={cn(
        !noFlex && "flex items-center gap-1",
        value && "cursor-pointer",
        "linkify"
      )}
      onClick={handleClick}
    >
      <H6 className="flex items-center gap-1">
        {icon}
        {title && (
          <div className="text-gray-500 dark:text-gray-200">
            {title}
            {!noFlex && ":"}
          </div>
        )}
      </H6>
      <H6 className={noFlex ? "mt-1" : ""}>{children}</H6>
    </div>
  );
};

export default MetaDetails;
