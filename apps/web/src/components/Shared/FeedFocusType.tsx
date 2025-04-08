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
    />
    <TabButton
      active={focus === MainContentFocus.TextOnly}
      name="Text"
      onClick={() => setFocus(MainContentFocus.TextOnly)}
    />
    <TabButton
      active={focus === MainContentFocus.Video}
      name="Video"
      onClick={() => setFocus(MainContentFocus.Video)}
    />
    <TabButton
      active={focus === MainContentFocus.Audio}
      name="Audio"
      onClick={() => setFocus(MainContentFocus.Audio)}
    />
    <TabButton
      active={focus === MainContentFocus.Image}
      name="Images"
      onClick={() => setFocus(MainContentFocus.Image)}
    />
  </div>
);

export default FeedFocusType;
