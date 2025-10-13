import { PERMISSIONS, STATIC_IMAGES_URL } from "@hey/data/constants";
import { useGroupQuery } from "@hey/indexer";
import { useParams } from "react-router";
import NewPost from "@/components/Composer/NewPost";
import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import Cover from "@/components/Shared/Cover";
import PageLayout from "@/components/Shared/PageLayout";
import { WarningMessage } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Details from "./Details";
import GroupFeed from "./GroupFeed";
import GroupPageShimmer from "./Shimmer";

const ViewGroup = () => {
  const { address } = useParams<{ address: string }>();
  const { currentAccount } = useAccountStore();

  const { data, loading, error } = useGroupQuery({
    skip: !address || Object.values(PERMISSIONS).includes(address as any),
    variables: { request: { group: address } }
  });

  if (!address || loading) {
    return <GroupPageShimmer />;
  }

  if (!data?.group) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const group = data.group;
  const isMember = group.operations?.isMember;
  const isBanned = group.operations?.isBanned;

  return (
    <PageLayout title={group.metadata?.name} zeroTopMargin>
      <Cover
        cover={
          group.metadata?.coverPicture || `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <Details group={group} />
      {isBanned && (
        <WarningMessage
          message="Please contact the group owner to unban yourself."
          title="You are banned from this group"
        />
      )}
      {currentAccount && isMember && !isBanned && (
        <NewPost feed={group.feed?.address} />
      )}
      <GroupFeed feed={group.feed?.address} />
    </PageLayout>
  );
};

export default ViewGroup;
