import { useEditorContext } from "@/components/Composer/Editor";
import { AudioPostSchema } from "@/components/Shared/Audio";
import collectActionParams from "@/helpers/collectActionParams";
import errorToast from "@/helpers/errorToast";
import getMentions from "@/helpers/getMentions";
import uploadMetadata from "@/helpers/uploadMetadata";
import useCreatePost from "@/hooks/useCreatePost";
import usePostMetadata from "@/hooks/usePostMetadata";
import { useNewPostModalStore } from "@/store/non-persisted/modal/useNewPostModalStore";
import { useCollectActionStore } from "@/store/non-persisted/post/useCollectActionStore";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import {
  DEFAULT_AUDIO_POST,
  usePostAudioStore
} from "@/store/non-persisted/post/usePostAudioStore";
import { usePostLicenseStore } from "@/store/non-persisted/post/usePostLicenseStore";
import { usePostLiveStore } from "@/store/non-persisted/post/usePostLiveStore";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePostVideoStore
} from "@/store/non-persisted/post/usePostVideoStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import type { PostFragment } from "@hey/indexer";
import type { IGif } from "@hey/types/giphy";
import type { NewAttachment } from "@hey/types/misc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseCreatePublicationProps {
  post?: PostFragment;
  feed?: string;
}

const useCreatePublication = ({ post, feed }: UseCreatePublicationProps) => {
  const { currentAccount } = useAccountStore();
  const { setShowNewPostModal } = useNewPostModalStore();
  const { postContent, quotedPost, setPostContent, setQuotedPost } =
    usePostStore();
  const { audioPost, setAudioPost } = usePostAudioStore();
  const { setVideoThumbnail, videoThumbnail } = usePostVideoStore();
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePostLiveStore();
  const { addAttachments, attachments, isUploading, setAttachments } =
    usePostAttachmentStore((state) => state);
  const { setLicense } = usePostLicenseStore();
  const { collectAction, reset: resetCollectSettings } = useCollectActionStore(
    (state) => state
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postContentError, setPostContentError] = useState("");

  const editor = useEditorContext();
  const getMetadata = usePostMetadata();

  const isComment = Boolean(post);
  const isQuote = Boolean(quotedPost);
  const hasAudio = attachments[0]?.type === "Audio";
  const hasVideo = attachments[0]?.type === "Video";

  const reset = () => {
    editor?.setMarkdown("");
    setIsSubmitting(false);
    setPostContent("");
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setQuotedPost();
    setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
    setAudioPost(DEFAULT_AUDIO_POST);
    setLicense(null);
    resetCollectSettings();
    setShowNewPostModal(false);
  };

  const onCompleted = () => {
    reset();
  };

  const onError = (error?: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const { createPost } = useCreatePost({
    commentOn: post,
    onCompleted,
    onError
  });

  useEffect(() => {
    setPostContentError("");
  }, [audioPost]);

  useEffect(() => {
    if (postContent.length > 25000) {
      setPostContentError("Content should not exceed 25000 characters!");
      return;
    }

    if (getMentions(postContent).length > 50) {
      setPostContentError("You can only mention 50 people at a time!");
      return;
    }

    setPostContentError("");
  }, [postContent]);

  const getTitlePrefix = () => {
    if (hasVideo) {
      return "Video";
    }

    return isComment ? "Comment" : isQuote ? "Quote" : "Post";
  };

  const handleCreatePost = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setIsSubmitting(true);
      if (hasAudio) {
        setPostContentError("");
        const parsedData = AudioPostSchema.safeParse(audioPost);
        if (!parsedData.success) {
          const issue = parsedData.error.issues[0];
          setIsSubmitting(false);
          return setPostContentError(issue.message);
        }
      }

      if (!postContent.length && !attachments.length) {
        setIsSubmitting(false);
        return setPostContentError(
          `${isComment ? "Comment" : isQuote ? "Quote" : "Post"} should not be empty!`
        );
      }

      setPostContentError("");

      const baseMetadata = {
        content: postContent.length > 0 ? postContent : undefined,
        title: hasAudio
          ? audioPost.title
          : `${getTitlePrefix()} by ${getAccount(currentAccount).usernameWithPrefix}`
      };

      const metadata = getMetadata({ baseMetadata });
      const contentUri = await uploadMetadata(metadata);

      return await createPost({
        variables: {
          request: {
            contentUri,
            ...(feed && { feed }),
            ...(isComment && { commentOn: { post: post?.id } }),
            ...(isQuote && { quoteOf: { post: quotedPost?.id } }),
            ...(collectAction.enabled && {
              actions: [{ ...collectActionParams(collectAction) }]
            })
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
      mimeType: "image/gif",
      previewUri: gif.images.original.url,
      type: "Image",
      uri: gif.images.original.url
    };
    addAttachments([attachment]);
  };

  return {
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
  };
};

export default useCreatePublication;
