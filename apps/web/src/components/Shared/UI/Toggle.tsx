import { Switch } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { memo } from "react";

interface ToggleProps {
  disabled?: boolean;
  on: boolean;
  setOn: (on: boolean) => void;
}

const switchVariants = cva(
  "inline-flex h-[22px] w-[42.5px] min-w-[42.5px] items-center rounded-full border-2 border-transparent outline-hidden duration-200 ease-in-out",
  {
    defaultVariants: { checked: false, disabled: false },
    variants: {
      checked: {
        false: "bg-gray-200 dark:bg-gray-500",
        true: "bg-black dark:bg-white"
      },
      disabled: { false: "", true: "cursor-not-allowed opacity-50" }
    }
  }
);

const thumbVariants = cva(
  "pointer-events-none inline-block size-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out dark:bg-black",
  {
    defaultVariants: { checked: false },
    variants: { checked: { false: "translate-x-0", true: "translate-x-5" } }
  }
);

const Toggle = ({ disabled = false, on, setOn }: ToggleProps) => {
  return (
    <Switch
      checked={on}
      className={switchVariants({ checked: on, disabled })}
      disabled={disabled}
      onChange={setOn}
    >
      <span className={thumbVariants({ checked: on })} />
    </Switch>
  );
};

export default memo(Toggle);
