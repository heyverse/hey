import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

interface HelpTooltipProps {
  children: ReactNode;
}

const HelpTooltip = ({ children }: HelpTooltipProps) => {
  if (!children) {
    return null;
  }

  return (
    <span className="cursor-pointer">
      <Tooltip content={<span>{children}</span>} placement="top">
        <InformationCircleIcon className="size-[15px] text-gray-500 dark:text-gray-200" />
      </Tooltip>
    </span>
  );
};

export default HelpTooltip;
