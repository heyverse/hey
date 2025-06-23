import { Switch } from "@headlessui/react";
import { memo } from "react";
import cn from "@/helpers/cn";

interface ToggleProps {
  disabled?: boolean;
  on: boolean;
  setOn: (on: boolean) => void;
}

const Toggle = ({ disabled = false, on, setOn }: ToggleProps) => {
  return (
    <Switch
      checked={on}
      className={({ checked }) =>
        cn(
          checked ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-500",
          disabled && "cursor-not-allowed opacity-50",
          "inline-flex h-[22px] w-[42.5px] min-w-[42.5px] items-center rounded-full border-2 border-transparent outline-hidden duration-200 ease-in-out"
        )
      }
      disabled={disabled}
      onChange={setOn}
    >
      <span
        className={cn(
          on ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block size-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-black"
        )}
      />
    </Switch>
  );
};

export default memo(Toggle);
