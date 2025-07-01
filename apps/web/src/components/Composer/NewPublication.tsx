import { ERRORS } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import type { PostFragment } from "@hey/indexer";
import type { IGif } from "@hey/types/giphy";
import type { NewAttachment } from "@hey/types/misc";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import Attachment from "@/components/Composer/Actions/Attachment";
import CollectSettings from "@/components/Composer/Actions/CollectSettings";
import Gif from "@/components/Composer/Actions/Gif";
import LivestreamSettings from "@/components/Composer/Actions/LivestreamSettings";
import LivestreamEditor from "@/components/Composer/Actions/LivestreamSettings/LivestreamEditor";
import RulesSettings from "@/components/Composer/Actions/RulesSettings";
import NewAttachments from "@/components/Composer/NewAttachments";
import QuotedPost from "@/components/Post/QuotedPost";
import { AudioPostSchema } from "@/components/Shared/Audio";
import Wrapper from "@/components/Shared/Embed/Wrapper";
import EmojiPicker from "@/components/Shared/EmojiPicker";
import { Button, Card, H6 } from "@/components/Shared/UI";
import collectActionParams from "@/helpers/collectActionParams";
import errorToast from "@/helpers/errorToast";
import getMentions from "@/helpers/getMentions";
import KeyboardShortcuts from "@/helpers/shortcuts";
import uploadMetadata from "@/helpers/uploadMetadata";
import useCreatePost from "@/hooks/useCreatePost";
import useEditPost from "@/hooks/useEditPost";
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
import { usePostRulesStore } from "@/store/non-persisted/post/usePostRulesStore";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePostVideoStore
} from "@/store/non-persisted/post/usePostVideoStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import GroupFeedSelector from "./Actions/GroupFeedSelector";
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
  const { setShow: setShowNewPostModal } = useNewPostModalStore();

  // Post store
  const {
    postContent,
    editingPost,
    quotedPost,
    setPostContent,
    setEditingPost,
    setQuotedPost
  } = usePostStore();

  // Audio store
  const { audioPost, setAudioPost } = usePostAudioStore();

  // Video store
  const { setVideoThumbnail, videoThumbnail } = usePostVideoStore();

  // Live video store
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePostLiveStore();

  // Attachment store
  const { addAttachments, attachments, isUploading, setAttachments } =
    usePostAttachmentStore();

  // License store
  const { setLicense } = usePostLicenseStore();

  // Collect module store
  const { collectAction, reset: resetCollectSettings } = useCollectActionStore(
    (state) => state
  );

  const { rules, setRules } = usePostRulesStore();

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [postContentError, setPostContentError] = useState("");
  const [selectedFeed, setSelectedFeed] = useState<string>(feed || "");

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
    setQuotedPost(undefined);
    setEditingPost(undefined);
    setRules(undefined);
    setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
    setAudioPost(DEFAULT_AUDIO_POST);
    setLicense(null);
    resetCollectSettings();
    setSelectedFeed(feed || "");
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

  const { editPost } = useEditPost({
    onCompleted,
    onError
  });

  useEffect(() => {
    setSelectedFeed(feed || "");
  }, [feed]);

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
      return toast.error(ERRORS.SignWallet);
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

      const baseMetadata = {
        content: postContent.length > 0 ? postContent : undefined,
        title: hasAudio
          ? audioPost.title
          : `${getTitlePrefix()} by ${getAccount(currentAccount).usernameWithPrefix}`
      };

      const metadata = getMetadata({ baseMetadata });
      const contentUri = await uploadMetadata(metadata);

      if (editingPost) {
        return await editPost({
          variables: { request: { contentUri, post: editingPost?.id } }
        });
      }

      return await createPost({
        variables: {
          request: {
            contentUri,
            ...((feed || selectedFeed) && { feed: feed || selectedFeed }),
            ...(isComment && { commentOn: { post: post?.id } }),
            ...(isQuote && { quoteOf: { post: quotedPost?.id } }),
            ...(collectAction.enabled && {
              actions: [{ ...collectActionParams(collectAction) }]
            }),
            ...(rules && {
              rules: { required: [{ followersOnlyRule: rules }] }
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

  useHotkeys(KeyboardShortcuts.CreatePost.key, () => handleCreatePost(), {
    enableOnContentEditable: true
  });

  return (
    <Card className={className} onClick={() => setShowEmojiPicker(false)}>
      <Editor isComment={isComment} />
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
          {editingPost ? null : (
            <>
              <CollectSettings />
              <RulesSettings />
              {isComment ? null : (
                <>
                  <LivestreamSettings />
                  {feed ? null : (
                    <GroupFeedSelector
                      onChange={setSelectedFeed}
                      selected={selectedFeed}
                    />
                  )}
                </>
              )}
            </>
          )}
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
            {editingPost ? "Update" : isComment ? "Comment" : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default withEditorContext(NewPublication);
