import SignupCard from "@/components/Shared/Auth/SignupCard";
import Footer from "@/components/Shared/Footer";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { memo } from "react";
import SetAccount from "./SetAccount";
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
          <SetAccount />
          <WhoToFollow />
        </>
      )}
      <Footer />
    </>
  );
};

export default memo(Sidebar);
