import { H6 } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import type { ReactNode } from "react";
import { toast } from "react-hot-toast";

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
  const handleClick = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    }
  };

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
