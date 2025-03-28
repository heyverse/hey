import MetaTags from "@/components/Common/MetaTags";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
  PageLoading
} from "@/components/Shared/UI";
import Custom404 from "@/pages/404";
import Custom500 from "@/pages/500";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { APP_NAME } from "@hey/data/constants";
import { useGroupQuery } from "@hey/indexer";
import { useRouter } from "next/router";
import SettingsSidebar from "../Sidebar";
import GroupSettingsForm from "./Form";

const GroupSettings = () => {
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
    return <PageLoading />;
  }

  if (error) {
    return <Custom500 />;
  }

  const group = data?.group;

  if (!group || currentAccount?.address !== group.owner) {
    return <Custom404 />;
  }

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Group settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar group={group} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <GroupSettingsForm group={group} />
      </GridItemEight>
    </GridLayout>
  );
};

export default GroupSettings;
