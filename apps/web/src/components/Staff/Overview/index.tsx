import MetaTags from "@components/Common/MetaTags";
import hasAccess from "@helpers/hasAccess";
import { APP_NAME } from "@hey/data/constants";
import { Features } from "@hey/data/features";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import Custom404 from "src/pages/404";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import StaffSidebar from "../Sidebar";
import App from "./App";
import Sponsorship from "./Sponsorship";

const Overview: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const isStaff = hasAccess(Features.Staff);

  if (!currentAccount || !isStaff) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <App />
        <Sponsorship />
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
