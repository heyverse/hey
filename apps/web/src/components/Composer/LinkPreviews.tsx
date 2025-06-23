import Oembed from "@/components/Shared/Post/Oembed";
import getURLs from "@/helpers/getURLs";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";

const LinkPreviews = () => {
  const { postContent, quotedPost } = usePostStore();
  const { attachments } = usePostAttachmentStore();
  const urls = getURLs(postContent);

  if (!urls.length || attachments.length || quotedPost) {
    return null;
  }

  return (
    <div className="m-5">
      <Oembed url={urls[0]} />
    </div>
  );
};

export default LinkPreviews;
