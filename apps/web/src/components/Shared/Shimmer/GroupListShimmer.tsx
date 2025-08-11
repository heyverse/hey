import { memo } from "react";
import SingleGroupShimmer from "./SingleGroupShimmer";

const GroupListShimmer = () => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <SingleGroupShimmer className="p-5" key={index} showJoinLeaveButton />
      ))}
    </div>
  );
};

export default memo(GroupListShimmer);
