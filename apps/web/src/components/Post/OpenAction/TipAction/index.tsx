import MenuTransition from "@/components/Shared/MenuTransition";
import { TipIcon } from "@/components/Shared/TipIcon";
import { Tooltip } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import nFormatter from "@hey/helpers/nFormatter";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { PostFragment } from "@hey/indexer";
import Action from "./Action";

interface TipActionProps {
  post: PostFragment;
  showCount: boolean;
}

const TipAction = ({ post, showCount }: TipActionProps) => {
  const hasTipped = post.operations?.hasTipped;
  const { tips } = post.stats;

  const iconClassName = showCount
    ? "w-[17px] sm:w-[20px]"
    : "w-[15px] sm:w-[18px]";

  return (
    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-200">
      <Menu as="div" className="relative">
        <MenuButton
          aria-label="Tip"
          className={cn(
            hasTipped
              ? "text-brand-500 hover:bg-brand-300/20"
              : "text-gray-500 hover:bg-gray-300/20 dark:text-gray-200",
            "rounded-full p-1.5 outline-offset-2"
          )}
          onClick={stopEventPropagation}
        >
          <Tooltip content="Tip" placement="top" withDelay>
            <TipIcon
              className={cn({ "text-brand-500": hasTipped }, iconClassName)}
            />
          </Tooltip>
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="absolute z-[5] mt-1 w-max rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <MenuItem>
              {({ close }) => <Action closePopover={close} post={post} />}
            </MenuItem>
          </MenuItems>
        </MenuTransition>
      </Menu>
      {(tips || 0) > 0 && !showCount && (
        <span
          className={cn(
            hasTipped ? "text-brand-500" : "text-gray-500 dark:text-gray-200",
            "text-[11px] sm:text-xs"
          )}
        >
          {nFormatter(tips || 0)}
        </span>
      )}
    </div>
  );
};

export default TipAction;
