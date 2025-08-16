import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import List from "./List";

const SessionsSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Sessions settings">
      <Card>
        <CardHeader icon={<BackButton path="/settings" />} title="Sessions" />
        <List />
      </Card>
    </PageLayout>
  );
};

export default SessionsSettings;
