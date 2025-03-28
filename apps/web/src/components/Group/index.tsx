import MetaTags from "@/components/Common/MetaTags";
import NewPost from "@/components/Composer/NewPost";
import Cover from "@/components/Shared/Cover";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
  WarningMessage
} from "@/components/Shared/UI";
import Custom404 from "@/pages/404";
import Custom500 from "@/pages/500";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { useGroupQuery } from "@hey/indexer";
import { useRouter } from "next/router";
import Details from "./Details";
import GroupFeed from "./GroupFeed";
import GroupPageShimmer from "./Shimmer";

const ViewGroup = () => {
  const {
    isReady,
    query: { address }
  } = useRouter();
  const { currentAccount } = useAccountStore();

  const { data, loading, error } = useGroupQuery({
    variables: { request: { group: address } },
    skip: !address
  });

  if (!isReady || loading) {
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
    <>
      <MetaTags
        description={group.metadata?.description || ""}
        title={`${group.metadata?.name} • ${APP_NAME}`}
      />
      <Cover
        cover={group.metadata?.icon || `${STATIC_IMAGES_URL}/patterns/2.svg`}
      />
      <GridLayout>
        <GridItemFour>
          <Details group={group} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {isBanned && (
            <WarningMessage
              title="You are banned from this group"
              message="Please contact the group owner to unban yourself."
            />
          )}
          {currentAccount && isMember && !isBanned && (
            <NewPost feed={group.feed} />
          )}
          <GroupFeed feed={group.feed} />
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewGroup;
