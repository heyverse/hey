import type { FeedItem } from "@hey/lens";
import type { FC } from "react";

import Profiles from "@components/Shared/Profiles";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface CombinedProps {
  feedItem: FeedItem;
}

const Combined: FC<CombinedProps> = ({ feedItem }) => {
  const { mirrors } = feedItem;

  const mirrorsLength = mirrors.length;

  const getAllProfiles = () => {
    let profiles = mirrors.map((event) => event.by);
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  const actionArray = [];
  if (mirrorsLength) {
    actionArray.push("mirrored");
  }

  return (
    <div className="ld-text-gray-500 flex flex-wrap items-center space-x-1 pb-4 text-[13px] leading-6">
      <SparklesIcon className="size-4" />
      <Profiles profiles={getAllProfiles()} />
      <div className="flex items-center space-x-1">
        {actionArray.map((action, index) => (
          <Fragment key={action}>
            <span>{action}</span>
            {index < actionArray.length - 2 && <span>, </span>}
            {index === actionArray.length - 2 && <span>and</span>}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Combined;
