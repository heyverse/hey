import BackButton from "@/components/Shared/BackButton";
import Footer from "@/components/Shared/Footer";
import PageLayout from "@/components/Shared/PageLayout";
import PostShimmer from "@/components/Shared/Shimmer/PostShimmer";
import PostsShimmer from "@/components/Shared/Shimmer/PostsShimmer";
import SingleAccountShimmer from "@/components/Shared/Shimmer/SingleAccountShimmer";
import { Card, CardHeader } from "@/components/Shared/UI";

interface PostPageShimmerProps {
  isQuotes?: boolean;
}

const PostPageShimmer = ({ isQuotes = false }: PostPageShimmerProps) => {
  return (
    <PageLayout
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
          <Footer />
        </div>
      }
      zeroTopMargin
    >
      <Card>
        <CardHeader
          icon={<BackButton />}
          title={isQuotes ? "Quotes" : "Post"}
        />
        {isQuotes ? <PostsShimmer hideCard /> : <PostShimmer />}
      </Card>
      {!isQuotes && <PostsShimmer />}
    </PageLayout>
  );
};

export default PostPageShimmer;
