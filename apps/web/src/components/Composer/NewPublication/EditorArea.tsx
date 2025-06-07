import QuotedPost from "@/components/Post/QuotedPost";
import Wrapper from "@/components/Shared/Embed/Wrapper";
import { H6 } from "@/components/Shared/UI";
import type { PostFragment } from "@hey/indexer";
import type { NewAttachment } from "@hey/types/misc";
import LivestreamEditor from "../Actions/LivestreamSettings/LivestreamEditor";
import { Editor } from "../Editor";
import LinkPreviews from "../LinkPreviews";
import NewAttachments from "../NewAttachments";

interface EditorAreaProps {
  isComment: boolean;
  attachments: NewAttachment[];
  postContentError: string;
  quotedPost?: PostFragment;
  showLiveVideoEditor: boolean;
}

const EditorArea = ({
  isComment,
  attachments,
  postContentError,
  quotedPost,
  showLiveVideoEditor
}: EditorAreaProps) => (
  <>
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
  </>
);

export default EditorArea;
