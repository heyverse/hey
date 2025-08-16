import getAvatar from "@hey/helpers/getAvatar";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Card, Image } from "@/components/Shared/UI";
import { usePostStore } from "@/store/non-persisted/post/usePostStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import NewPublication from "./NewPublication";

interface NewPostProps {
  feed?: string;
}

const NewPost = ({ feed }: NewPostProps) => {
  const [searchParams] = useSearchParams();
  const text = searchParams.get("text");
  const url = searchParams.get("url");
  const via = searchParams.get("via");

  const { currentAccount } = useAccountStore();
  const { setPostContent } = usePostStore();
  const [showComposer, setShowComposer] = useState(false);

  const handleOpenComposer = () => {
    setShowComposer(true);
  };

  useEffect(() => {
    if (text) {
      const content = `${text}${url ? `\n\n${url}` : ""}${via ? `\n\nvia @${via}` : ""}`;
      handleOpenComposer();
      setPostContent(content);
    }
  }, [text, url, via]);

  if (showComposer) {
    return <NewPublication feed={feed} />;
  }

  return (
    <Card
      className="cursor-pointer space-y-3 px-5 py-4"
      onClick={handleOpenComposer}
    >
      <div className="flex items-center space-x-3">
        <Image
          alt={currentAccount?.address}
          className="size-11 cursor-pointer rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700"
          height={44}
          src={getAvatar(currentAccount)}
          width={44}
        />
        <span className="text-gray-500 dark:text-gray-200">What's new?!</span>
      </div>
    </Card>
  );
};

export default NewPost;
