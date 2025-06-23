import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { PostFragment } from "@hey/indexer";
import { AnimateNumber } from "motion-plus-react";
import { TipIcon } from "@/components/Shared/Icons/TipIcon";
import MenuTransition from "@/components/Shared/MenuTransition";
import TipMenu from "@/components/Shared/TipMenu";
import { Tooltip } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";

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
            anchor="bottom start"
            className="z-[5] mt-2 w-max origin-top-left rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <MenuItem>
              {({ close }) => <TipMenu closePopover={close} post={post} />}
            </MenuItem>
          </MenuItems>
        </MenuTransition>
      </Menu>
      {(tips || 0) > 0 && !showCount && (
        <AnimateNumber
          className={cn(
            hasTipped ? "text-brand-500" : "text-gray-500 dark:text-gray-200",
            "w-3 text-[11px] sm:text-xs"
          )}
          format={{ notation: "compact" }}
          key={`tip-count-${post.id}`}
          transition={{ type: "tween" }}
        >
          {tips || 0}
        </AnimateNumber>
      )}
    </div>
  );
};

export default TipAction;
