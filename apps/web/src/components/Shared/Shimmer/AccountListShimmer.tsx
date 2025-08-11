import { memo } from "react";
import SingleAccountShimmer from "./SingleAccountShimmer";

const AccountListShimmer = () => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <SingleAccountShimmer
          className="p-5"
          key={index}
          showFollowUnfollowButton
        />
      ))}
    </div>
  );
};

export default memo(AccountListShimmer);
