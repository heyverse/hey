import { H6, Toggle } from "@/components/Shared/UI";
import type { ReactNode } from "react";

interface ToggleWithHelperProps {
  description?: ReactNode;
  disabled?: boolean;
  heading?: ReactNode;
  icon?: ReactNode;
  on: boolean;
  setOn: (on: boolean) => void;
}

const ToggleWithHelper = ({
  description,
  disabled = false,
  heading,
  icon,
  on,
  setOn
}: ToggleWithHelperProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start space-x-3">
        {icon && <span className="mt-1">{icon}</span>}
        <div>
          {heading && <b>{heading}</b>}
          {description && (
            <H6 className="font-normal text-gray-500 dark:text-gray-200">
              {description}
            </H6>
          )}
        </div>
      </div>
      <Toggle disabled={disabled} on={on} setOn={setOn} />
    </div>
  );
};

export default ToggleWithHelper;
