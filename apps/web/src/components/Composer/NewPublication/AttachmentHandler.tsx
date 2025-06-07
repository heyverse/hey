import EmojiPicker from "@/components/Shared/EmojiPicker";
import type { IGif } from "@hey/types/giphy";
import type { Dispatch, SetStateAction } from "react";
import Attachment from "../Actions/Attachment";
import CollectSettings from "../Actions/CollectSettings";
import Gif from "../Actions/Gif";
import LivestreamSettings from "../Actions/LivestreamSettings";
import type { EditorHandle } from "../Editor/EditorHandle";

interface AttachmentHandlerProps {
  editor: EditorHandle | null;
  isComment: boolean;
  setGifAttachment: (gif: IGif) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
}

const AttachmentHandler = ({
  editor,
  isComment,
  setGifAttachment,
  showEmojiPicker,
  setShowEmojiPicker
}: AttachmentHandlerProps) => (
  <div className="flex items-center space-x-4">
    <Attachment />
    <EmojiPicker
      setEmoji={(emoji: string) => {
        setShowEmojiPicker(false);
        editor?.insertText(emoji);
      }}
      setShowEmojiPicker={setShowEmojiPicker}
      showEmojiPicker={showEmojiPicker}
    />
    <Gif setGifAttachment={setGifAttachment} />
    <CollectSettings />
    {!isComment && <LivestreamSettings />}
  </div>
);

export default AttachmentHandler;
