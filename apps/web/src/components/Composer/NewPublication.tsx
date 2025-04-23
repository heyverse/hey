import NewAttachments from "@/components/Composer/NewAttachments";
import QuotedPost from "@/components/Post/QuotedPost";
import { AudioPostSchema } from "@/components/Shared/Audio";
import Wrapper from "@/components/Shared/Embed/Wrapper";
import EmojiPicker from "@/components/Shared/EmojiPicker";
import { Button, Card, H6 } from "@/components/Shared/UI";
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
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import type { PostFragment } from "@hey/indexer";
import type { IGif } from "@hey/types/giphy";
import type { NewAttachment } from "@hey/types/misc";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Attachment from "./Actions/Attachment";
import CollectSettings from "./Actions/CollectSettings";
import Gif from "./Actions/Gif";
import GroupSettings from "./Actions/GroupSettings";
import LivestreamSettings from "./Actions/LivestreamSettings";
import LivestreamEditor from "./Actions/LivestreamSettings/LivestreamEditor";
import { Editor, useEditorContext, withEditorContext } from "./Editor";
import LinkPreviews from "./LinkPreviews";

interface NewPublicationProps {
  className?: string;
  post?: PostFragment;
  feed?: string;
}

const NewPublication = ({ className, post, feed }: NewPublicationProps) => {
  const { currentAccount } = useAccountStore();

  // New post modal store
  const { setShowNewPostModal } = useNewPostModalStore();

  // Post store
  const { postContent, quotedPost, setPostContent, setQuotedPost } =
    usePostStore();

  // Audio store
  const { audioPost, setAudioPost } = usePostAudioStore();

  // Video store
  const { setVideoThumbnail, videoThumbnail } = usePostVideoStore();

  // Live video store
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePostLiveStore();

  // Attachment store
  const { addAttachments, attachments, isUploading, setAttachments } =
    usePostAttachmentStore((state) => state);

  // License store
  const { setLicense } = usePostLicenseStore();

  // Collect module store
  const { collectAction, reset: resetCollectSettings } = useCollectActionStore(
    (state) => state
  );

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
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

  const getAnimationUrl = () => {
    const fallback = `${STATIC_IMAGES_URL}/thumbnail.png`;

    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.uri || fallback;
    }

    return fallback;
  };

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
          `${
            isComment ? "Comment" : isQuote ? "Quote" : "Post"
          } should not be empty!`
        );
      }

      setPostContentError("");

      const processedPostContent =
        postContent.length > 0 ? postContent : undefined;
      const title = hasAudio
        ? audioPost.title
        : `${getTitlePrefix()} by ${getAccount(currentAccount).usernameWithPrefix}`;

      const baseMetadata = {
        content: processedPostContent,
        title,
        marketplace: {
          name: title,
          description: processedPostContent,
          animation_url: getAnimationUrl(),
          external_url: `https://hey.xyz${getAccount(currentAccount).link}`
        }
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

  return (
    <Card className={className} onClick={() => setShowEmojiPicker(false)}>
      <Editor />
      {postContentError ? (
        <H6 className="mt-1 px-5 pb-3 text-red-500">{postContentError}</H6>
      ) : null}
      {showLiveVideoEditor ? <LivestreamEditor /> : null}
      <LinkPreviews />
      <NewAttachments attachments={attachments} />
      {quotedPost ? (
        <Wrapper className="m-5" zeroPadding>
          <QuotedPost isNew post={quotedPost} />
        </Wrapper>
      ) : null}
      <div className="divider mx-5" />
      <div className="block items-center px-5 py-3 sm:flex">
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
          <Gif setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          <CollectSettings />
          {!isComment && <LivestreamSettings />}
          <GroupSettings />
        </div>
        <div className="mt-2 ml-auto sm:mt-0">
          <Button
            disabled={
              isSubmitting ||
              isUploading ||
              videoThumbnail.uploading ||
              postContentError.length > 0
            }
            loading={isSubmitting}
            onClick={handleCreatePost}
          >
            {isComment ? "Comment" : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default withEditorContext(NewPublication);
