import { MenuItem } from "@headlessui/react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { ERRORS } from "@hey/data/errors";
import type { PostFragment } from "@hey/indexer";
import { toast } from "sonner";
import cn from "@/helpers/cn";
import { useNewPostModalStore } from "@/store/non-persisted/modal/useNewPostModalStore";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface QuoteProps {
  post: PostFragment;
}

const Quote = ({ post }: QuoteProps) => {
  const { currentAccount } = useAccountStore();
  const { setShow: setShowNewPostModal } = useNewPostModalStore();
  const { setQuotedPost } = usePostStore();

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm"
        )
      }
      onClick={() => {
        if (!currentAccount) {
          return toast.error(ERRORS.SignWallet);
        }
        setQuotedPost(post);
        setShowNewPostModal(true);
      }}
    >
      <div className="flex items-center space-x-2">
        <ChatBubbleBottomCenterTextIcon className="size-4" />
        <div>{post.commentOn ? "Quote comment" : "Quote post"}</div>
      </div>
    </MenuItem>
  );
};

export default Quote;
