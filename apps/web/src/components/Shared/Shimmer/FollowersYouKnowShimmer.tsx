const FollowersYouKnowShimmer = () => {
  return (
    <div className="flex items-center gap-x-2">
      <div className="-space-x-2 flex">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="shimmer size-5 rounded-full" />
        ))}
      </div>
      <div className="shimmer h-3 w-1/5 rounded-lg" />
    </div>
  );
};

export default FollowersYouKnowShimmer;
