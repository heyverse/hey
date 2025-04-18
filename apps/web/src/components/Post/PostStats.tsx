import Likes from "@/components/Shared/Modal/Likes";
import PostExecutors from "@/components/Shared/Modal/PostExecutors";
import Reposts from "@/components/Shared/Modal/Reposts";
import { Modal } from "@/components/Shared/UI";
import type { PostFragment } from "@hey/indexer";
import { AnimateNumber } from "motion-plus-react";
import plur from "plur";
import { memo, useState } from "react";
import { Link } from "react-router";

const AnimatedNumber = ({
  key,
  name,
  value
}: {
  key: string;
  name: string;
  value: number;
}) => {
  return (
    <span className="flex items-center gap-x-1">
      <AnimateNumber
        key={key}
        format={{ notation: "compact" }}
        transition={{ type: "tween" }}
        className="font-bold text-black dark:text-white"
      >
        {value}
      </AnimateNumber>
      {plur(name, value)}
    </span>
  );
};

type PostExecutorsType = "Tippers" | "Collectors";

interface PostStatsProps {
  post: PostFragment;
}

const PostStats = ({ post }: PostStatsProps) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showRepostsModal, setShowRepostsModal] = useState(false);
  const [showPostExecutorsModal, setShowPostExecutorsModal] =
    useState<PostExecutorsType | null>(null);

  const { bookmarks, comments, reposts, quotes, reactions, collects, tips } =
    post.stats;

  const showStats =
    comments > 0 ||
    reactions > 0 ||
    reposts > 0 ||
    quotes > 0 ||
    bookmarks > 0 ||
    collects > 0 ||
    tips > 0;

  if (!showStats) {
    return null;
  }

  return (
    <>
      <div className="divider" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3 text-gray-500 text-sm dark:text-gray-200">
        {comments > 0 ? (
          <AnimatedNumber
            key={`comment-count-${post.id}`}
            name="Comment"
            value={comments}
          />
        ) : null}
        {reposts > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowRepostsModal(true)}
            type="button"
          >
            <AnimatedNumber
              key={`repost-count-${post.id}`}
              name="Repost"
              value={reposts}
            />
          </button>
        ) : null}
        {quotes > 0 ? (
          <Link className="outline-offset-2" to={`/posts/${post.slug}/quotes`}>
            <AnimatedNumber
              key={`quote-count-${post.id}`}
              name="Quote"
              value={quotes}
            />
          </Link>
        ) : null}
        {reactions > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowLikesModal(true)}
            type="button"
          >
            <AnimatedNumber
              key={`like-count-${post.id}`}
              name="Like"
              value={reactions}
            />
          </button>
        ) : null}
        {tips > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowPostExecutorsModal("Tippers")}
            type="button"
          >
            <AnimatedNumber
              key={`tip-count-${post.id}`}
              name="Tip"
              value={tips}
            />
          </button>
        ) : null}
        {collects > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowPostExecutorsModal("Collectors")}
            type="button"
          >
            <AnimatedNumber
              key={`collect-count-${post.id}`}
              name="Collect"
              value={collects}
            />
          </button>
        ) : null}
        {bookmarks > 0 ? (
          <AnimatedNumber
            key={`bookmark-count-${post.id}`}
            name="Bookmark"
            value={bookmarks}
          />
        ) : null}
      </div>
      <Modal
        onClose={() => setShowLikesModal(false)}
        show={showLikesModal}
        title="Likes"
      >
        <Likes postId={post.id} />
      </Modal>
      <Modal
        onClose={() => setShowRepostsModal(false)}
        show={showRepostsModal}
        title="Reposts"
      >
        <Reposts postId={post.id} />
      </Modal>
      <Modal
        onClose={() => setShowPostExecutorsModal(null)}
        show={showPostExecutorsModal !== null}
        title={showPostExecutorsModal === "Tippers" ? "Tippers" : "Collectors"}
      >
        <PostExecutors
          postId={post.id}
          filter={
            showPostExecutorsModal === "Tippers"
              ? { tipping: true }
              : { simpleCollect: true }
          }
        />
      </Modal>
    </>
  );
};

export default memo(PostStats);
