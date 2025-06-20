import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import PersonalizeSettingsForm from "./Form";

const PersonalizeSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Personalize settings">
      <PersonalizeSettingsForm />
    </PageLayout>
  );
};

export default PersonalizeSettings;
