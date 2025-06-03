import errorToast from "@/helpers/errorToast";
import { hono } from "@/helpers/fetcher";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import { useMutation } from "@tanstack/react-query";
import { franc } from "franc";
import { useState } from "react";
import Markup from "../Shared/Markup";
import { Spinner } from "../Shared/UI";

interface TranslateProps {
  post: AnyPostFragment;
}

const Translate = ({ post }: TranslateProps) => {
  const [translation, setTranslation] = useState<string | null>(null);

  const targetPost = isRepost(post) ? post?.repostOf : post;
  const { metadata } = targetPost;
  const filteredContent = getPostData(metadata)?.content;
  const isEnglish = franc(filteredContent) === "eng";

  const { mutate, isPending } = useMutation({
    mutationFn: ({ post }: { post: string }) => hono.ai.translate(post),
    onSuccess: (data) => setTranslation(data.text),
    onError: errorToast
  });

  if (isEnglish) {
    return null;
  }

  if (isPending) {
    return (
      <div className="mt-3">
        <div className="flex items-center gap-x-1.5">
          <Spinner size="xs" />
          <b className="text-gray-500 text-sm">Translating...</b>
        </div>
      </div>
    );
  }

  if (!translation?.length) {
    return (
      <button
        className="mt-3 block font-bold text-gray-500 text-sm"
        onClick={() => mutate({ post: targetPost.id })}
        type="button"
      >
        Translate to English
      </button>
    );
  }

  return (
    <div className="mt-3">
      <div className="divider mb-3" />
      <Markup
        className="markup linkify break-words"
        mentions={targetPost.mentions}
      >
        {translation}
      </Markup>
    </div>
  );
};

export default Translate;
