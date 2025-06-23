import { useGroupQuery } from "@hey/indexer";
import { useParams } from "react-router";
import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import ApprovalRule from "./ApprovalRule";

const RulesSettings = () => {
  const { address } = useParams<{ address: string }>();
  const { currentAccount } = useAccountStore();

  const { data, loading, error } = useGroupQuery({
    skip: !address,
    variables: { request: { group: address } }
  });

  if (!address || loading) {
    return null;
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
    <PageLayout title="Rules settings">
      <Card>
        <CardHeader
          icon={<BackButton path={`/g/${group.address}/settings`} />}
          title="Rules"
        />
        <ApprovalRule group={group} />
      </Card>
    </PageLayout>
  );
};

export default RulesSettings;
