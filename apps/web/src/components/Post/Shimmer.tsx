import Footer from "@/components/Shared/Footer";
import PostListShimmer from "@/components/Shared/Shimmer/PostListShimmer";
import PostShimmer from "@/components/Shared/Shimmer/PostShimmer";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import SingleAccountShimmer from "@/components/Shared/Shimmer/SingleAccountShimmer";
import { Card } from "@/components/Shared/UI";
import { GeneralPageLayout } from "../Shared/PageLayout";

interface PublicationPageShimmerProps {
  publicationList?: boolean;
}

const PublicationPageShimmer = ({
  publicationList = false
}: PublicationPageShimmerProps) => {
  return (
    <GeneralPageLayout
      sidebar={
        <div className="space-y-5">
          <Card className="p-5">
            <SingleAccountShimmer />
          </Card>
          <Card className="space-y-4 p-5">
            <SingleAccountShimmer showFollowUnfollowButton />
            <SingleAccountShimmer showFollowUnfollowButton />
            <SingleAccountShimmer showFollowUnfollowButton />
            <SingleAccountShimmer showFollowUnfollowButton />
            <SingleAccountShimmer showFollowUnfollowButton />
          </Card>
          <Card className="flex justify-between p-5">
            <div className="shimmer h-3 w-1/2 rounded-lg" />
            <div className="shimmer h-3 w-1/4 rounded-lg" />
          </Card>
          <Footer />
        </div>
      }
    >
      {publicationList ? (
        <PostListShimmer />
      ) : (
        <>
          <Card>
            <PostShimmer />
          </Card>
          <PostsShimmer />
        </>
      )}
    </GeneralPageLayout>
  );
};

export default PublicationPageShimmer;
