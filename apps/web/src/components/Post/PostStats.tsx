import Collectors from "@/components/Shared/Modal/Collectors";
import Likes from "@/components/Shared/Modal/Likes";
import Reposts from "@/components/Shared/Modal/Reposts";
import { Modal } from "@/components/Shared/UI";
import type { PostFragment } from "@hey/indexer";
import { AnimateNumber } from "motion-plus-react";
import plur from "plur";
import { memo, useState } from "react";
import { Link } from "react-router";

const AnimatedNumber = ({ name, value }: { name: string; value: number }) => {
  return (
    <span className="flex items-center gap-x-1">
      <AnimateNumber
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

interface PostStatsProps {
  post: PostFragment;
}

const PostStats = ({ post }: PostStatsProps) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showRepostsModal, setShowRepostsModal] = useState(false);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);

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
          <AnimatedNumber name="Comment" value={comments} />
        ) : null}
        {reposts > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowRepostsModal(true)}
            type="button"
          >
            <AnimatedNumber name="Repost" value={reposts} />
          </button>
        ) : null}
        {quotes > 0 ? (
          <Link className="outline-offset-2" to={`/posts/${post.slug}/quotes`}>
            <AnimatedNumber name="Quote" value={quotes} />
          </Link>
        ) : null}
        {reactions > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowLikesModal(true)}
            type="button"
          >
            <AnimatedNumber name="Like" value={reactions} />
          </button>
        ) : null}
        {tips > 0 ? <AnimatedNumber name="Tip" value={tips} /> : null}
        {collects > 0 ? (
          <button
            className="outline-offset-2"
            onClick={() => setShowCollectorsModal(true)}
            type="button"
          >
            <AnimatedNumber name="Collect" value={collects} />
          </button>
        ) : null}
        {bookmarks > 0 ? (
          <AnimatedNumber name="Bookmark" value={bookmarks} />
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
        onClose={() => setShowCollectorsModal(false)}
        show={showCollectorsModal}
        title="Collectors"
      >
        <Collectors postId={post.id} />
      </Modal>
    </>
  );
};

export default memo(PostStats);
