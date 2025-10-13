import { memo } from "react";
import SignupCard from "@/components/Shared/Auth/SignupCard";
import Footer from "@/components/Shared/Footer";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import BetaBanner from "./BetaBanner";
import ProBanner from "./ProBanner";
import WhoToFollow from "./WhoToFollow";

const Sidebar = () => {
  const { currentAccount } = useAccountStore();
  const loggedInWithAccount = Boolean(currentAccount);
  const loggedOut = !loggedInWithAccount;

  return (
    <>
      {loggedOut && <SignupCard />}
      {loggedInWithAccount && (
        <>
          <BetaBanner />
          <ProBanner />
          <WhoToFollow />
        </>
      )}
      <Footer />
    </>
  );
};

export default memo(Sidebar);
