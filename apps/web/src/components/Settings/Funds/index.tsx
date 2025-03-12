import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { APP_NAME } from "@hey/data/constants";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@hey/ui";
import type { NextPage } from "next";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import Balances from "./Balances";

const FundsSettings: NextPage = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Funds settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardHeader
            title="Manage account balances"
            body="Withdraw or deposit funds from your account."
          />
          <Balances />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default FundsSettings;
