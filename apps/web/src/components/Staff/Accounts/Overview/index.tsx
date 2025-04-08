import Custom404 from "@/components/Shared/404";
import Loader from "@/components/Shared/Loader";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, EmptyState, ErrorMessage } from "@/components/Shared/UI";
import AccountStaffTool from "@/components/Staff/Accounts/Overview/Tool";
import StaffSidebar from "@/components/Staff/Sidebar";
import hasAccess from "@/helpers/hasAccess";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserIcon } from "@heroicons/react/24/outline";
import { Features } from "@hey/data/features";
import { useAccountQuery } from "@hey/indexer";
import { useParams } from "react-router";

const StaffAccountOverview = () => {
  const { address } = useParams<{ address: string }>();
  const { currentAccount } = useAccountStore();
  const isStaff = hasAccess(Features.Staff);

  const { data, error, loading } = useAccountQuery({
    skip: !address,
    variables: { request: { address: address } }
  });

  const account = data?.account;

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <PageLayout
      title="Staff Tools - Account Overview"
      sidebar={<StaffSidebar />}
      sidebarPosition="left"
    >
      <Card className="!bg-yellow-300/20 border-yellow-600 border-dashed p-5">
        {loading ? (
          <Loader className="my-5" message="Loading account" />
        ) : account ? (
          error ? (
            <ErrorMessage error={error} />
          ) : (
            <AccountStaffTool account={account} />
          )
        ) : (
          <EmptyState
            hideCard
            icon={<UserIcon className="size-8" />}
            message="No account found"
          />
        )}
      </Card>
    </PageLayout>
  );
};

export default StaffAccountOverview;
