import { Card } from "@/components/Shared/UI";
import KeyboardShortcuts from "@/helpers/shortcuts";
import useCreatePublication from "@/hooks/useCreatePublication";
import type { PostFragment } from "@hey/indexer";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useEditorContext, withEditorContext } from "./Editor";
import AttachmentHandler from "./NewPublication/AttachmentHandler";
import EditorArea from "./NewPublication/EditorArea";
import SubmitActions from "./NewPublication/SubmitActions";

interface NewPublicationProps {
  className?: string;
  post?: PostFragment;
  feed?: string;
}

const NewPublication = ({ className, post, feed }: NewPublicationProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editor = useEditorContext();
  const {
    attachments,
    isUploading,
    videoThumbnail,
    showLiveVideoEditor,
    isComment,
    quotedPost,
    postContentError,
    handleCreatePost,
    isSubmitting,
    setGifAttachment
  } = useCreatePublication({ post, feed });

  useHotkeys(KeyboardShortcuts.CreatePost.key, () => handleCreatePost(), {
    enableOnContentEditable: true
  });

  return (
    <Card className={className} onClick={() => setShowEmojiPicker(false)}>
      <EditorArea
        attachments={attachments}
        isComment={isComment}
        postContentError={postContentError}
        quotedPost={quotedPost}
        showLiveVideoEditor={showLiveVideoEditor}
      />
      <div className="divider mx-5" />
      <div className="block items-center px-5 py-3 sm:flex">
        <AttachmentHandler
          editor={editor}
          isComment={isComment}
          setGifAttachment={setGifAttachment}
          setShowEmojiPicker={setShowEmojiPicker}
          showEmojiPicker={showEmojiPicker}
        />
        <SubmitActions
          disabled={
            isSubmitting ||
            isUploading ||
            videoThumbnail.uploading ||
            postContentError.length > 0
          }
          handleSubmit={handleCreatePost}
          isComment={isComment}
          loading={isSubmitting}
        />
      </div>
    </Card>
  );
};

export default withEditorContext(NewPublication);
