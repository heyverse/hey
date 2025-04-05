import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import { PageLoading } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useGroupQuery } from "@hey/indexer";
import { useParams } from "react-router";
import SettingsSidebar from "../Sidebar";
import GroupSettingsForm from "./Form";

const GroupSettings = () => {
  const { address } = useParams<{ address: string }>();
  const { currentAccount } = useAccountStore();

  const { data, loading, error } = useGroupQuery({
    variables: { request: { group: address } },
    skip: !address
  });

  if (!address || loading) {
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
    <SettingsPageLayout title="Group settings" sidebar={<SettingsSidebar />}>
      <GroupSettingsForm group={group} />
    </SettingsPageLayout>
  );
};

export default GroupSettings;
