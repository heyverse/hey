import { Tooltip } from "@/components/Shared/UI";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { useClickAway } from "@uidotdev/usehooks";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import List from "./List";

interface EmojiPickerProps {
  emoji?: null | string;
  setEmoji: (emoji: string) => void;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  showEmojiPicker: boolean;
}

const EmojiPicker = ({
  emoji,
  setEmoji,
  setShowEmojiPicker,
  showEmojiPicker
}: EmojiPickerProps) => {
  const listRef = useClickAway(() => {
    setShowEmojiPicker(false);
  }) as MutableRefObject<HTMLDivElement>;

  return (
    <Tooltip content="Emoji" placement="top">
      <div className="relative" ref={listRef}>
        <button
          aria-label="Emoji"
          className="rounded-full outline-offset-8"
          onClick={(e) => {
            e.preventDefault();
            stopEventPropagation(e);
            setShowEmojiPicker(!showEmojiPicker);
          }}
          type="button"
        >
          {emoji ? (
            <span className="text-lg">{emoji}</span>
          ) : (
            <FaceSmileIcon className="size-5" />
          )}
        </button>
        {showEmojiPicker ? (
          <div className="absolute z-[5] mt-1 w-[300px] rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900">
            <List setEmoji={setEmoji} />
          </div>
        ) : null}
      </div>
    </Tooltip>
  );
};

export default EmojiPicker;
