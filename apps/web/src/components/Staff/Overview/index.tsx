import Custom404 from "@/components/Shared/404";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import {} from "@/components/Shared/UI";
import hasAccess from "@/helpers/hasAccess";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Features } from "@hey/data/features";
import StaffSidebar from "../Sidebar";
import App from "./App";
import Sponsorship from "./Sponsorship";

const StaffOverview = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = hasAccess(Features.Staff);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <SettingsPageLayout title="Staff Tools" sidebar={<StaffSidebar />}>
      <App />
      <Sponsorship />
    </SettingsPageLayout>
  );
};

export default StaffOverview;
