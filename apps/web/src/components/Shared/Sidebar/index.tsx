import SignupCard from "@/components/Shared/Auth/SignupCard";
import Footer from "@/components/Shared/Footer";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { memo } from "react";
import SetAccount from "./SetAccount";
import WhoToFollow from "./WhoToFollow";

const Sidebar = () => {
  const { currentAccount } = useAccountStore();
  const loggedInWithProfile = Boolean(currentAccount);
  const loggedOut = !loggedInWithProfile;

  return (
    <>
      {/* <Gitcoin /> */}
      {loggedOut && <SignupCard />} {/* Onboarding steps */}
      {loggedInWithProfile && <SetAccount />}
      {loggedInWithProfile && <WhoToFollow />}
      <Footer />
    </>
  );
};

export default memo(Sidebar);
