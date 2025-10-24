import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Card } from "../Shared/UI";

const Mint = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return <Card className="p-5">Gm</Card>;
};

export default Mint;
