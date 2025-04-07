import SingleGroupShimmer from "./SingleGroupShimmer";

const GroupListShimmer = () => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <SingleGroupShimmer key={index} className="p-5" showJoinLeaveButton />
      ))}
    </div>
  );
};

export default GroupListShimmer;
