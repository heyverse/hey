import Custom404 from "@/components/Shared/404";
import PageLayout from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Overview from "./Overview";

const Staff = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount?.isStaff) {
    return <Custom404 />;
  }

  return (
    <PageLayout title="Staff" sidebar={null}>
      <Overview />
    </PageLayout>
  );
};

export default Staff;
