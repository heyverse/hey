import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import LinkUsername from "./LinkUsername";
import UnlinkUsername from "./UnlinkUsername";

const UsernameSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Username settings">
      <Card>
        <CardHeader icon={<BackButton path="/settings" />} title="Username" />
        <UnlinkUsername />
        <div className="divider" />
        <LinkUsername />
      </Card>
    </PageLayout>
  );
};

export default UsernameSettings;
