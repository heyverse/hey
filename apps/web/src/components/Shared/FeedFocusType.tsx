import { MainContentFocus } from "@hey/indexer";
import type { Dispatch, SetStateAction } from "react";
import { TabButton } from "./UI";

interface FeedFocusTypeProps {
  focus?: MainContentFocus;
  setFocus: Dispatch<SetStateAction<MainContentFocus | undefined>>;
}

const FeedFocusType = ({ focus, setFocus }: FeedFocusTypeProps) => (
  <div className="mx-5 flex flex-wrap gap-3 md:mx-0">
    <TabButton
      active={!focus}
      name="All posts"
      onClick={() => setFocus(undefined)}
      showOnSm
    />
    <TabButton
      active={focus === MainContentFocus.TextOnly}
      name="Text"
      onClick={() => setFocus(MainContentFocus.TextOnly)}
      showOnSm
    />
    <TabButton
      active={focus === MainContentFocus.Video}
      name="Video"
      onClick={() => setFocus(MainContentFocus.Video)}
      showOnSm
    />
    <TabButton
      active={focus === MainContentFocus.Audio}
      name="Audio"
      onClick={() => setFocus(MainContentFocus.Audio)}
      showOnSm
    />
    <TabButton
      active={focus === MainContentFocus.Image}
      name="Images"
      onClick={() => setFocus(MainContentFocus.Image)}
      showOnSm
    />
  </div>
);

export default FeedFocusType;
