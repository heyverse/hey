import { MainContentFocus } from "@hey/indexer";
import type { Dispatch, SetStateAction } from "react";
import { Tabs } from "../UI";

interface ContentFeedTypeProps {
  focus?: MainContentFocus;
  setFocus: Dispatch<SetStateAction<MainContentFocus | undefined>>;
  layoutId: string;
}

const ContentFeedType = ({
  focus,
  setFocus,
  layoutId
}: ContentFeedTypeProps) => {
  const tabs = [
    { name: "All posts", type: "" },
    { name: "Text", type: MainContentFocus.TextOnly },
    { name: "Video", type: MainContentFocus.Video },
    { name: "Audio", type: MainContentFocus.Audio },
    { name: "Images", type: MainContentFocus.Image }
  ];

  return (
    <Tabs
      tabs={tabs}
      active={focus || ""}
      setActive={(type) => setFocus(type as MainContentFocus)}
      className="mx-5 mb-5 md:mx-0"
      layoutId={layoutId}
    />
  );
};

export default ContentFeedType;
