import type { ReactNode } from "react";
import { Tooltip } from "@/components/Shared/UI";

interface ToggleProps {
  children: ReactNode;
  disabled?: boolean;
  onClick?: VoidFunction;
  pressed: boolean;
  tooltip?: string;
}

const Toggle = ({
  children,
  disabled = false,
  onClick,
  pressed,
  tooltip
}: ToggleProps) => {
  return (
    <Tooltip content={tooltip} placement="top">
      <button
        className="flex items-center justify-center rounded-lg bg-transparent p-2 text-black hover:bg-gray-100 data-[state=on]:bg-gray-200 dark:text-white dark:data-[state=on]:bg-gray-700 dark:hover:bg-gray-800"
        data-state={pressed ? "on" : "off"}
        disabled={disabled}
        onClick={() => onClick?.()}
        onMouseDown={(event) => event.preventDefault()}
        type="button"
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default Toggle;
