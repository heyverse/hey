import { useState } from "react";
import { useAccount } from "wagmi";
import Login from "@/components/Shared/Auth/Login";
import { SignupMessage } from "@/components/Shared/Auth/Signup/ChooseUsername";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import AuthMessage from "./AuthMessage";
import Signup from "./Signup";

const NotConnected = ({ isLogin }: { isLogin?: boolean }) => (
  <AuthMessage
    description="Connect with our wallet provider to access your account."
    title={`${isLogin ? "Login" : "Signup"} to Hey.`}
  />
);

const Auth = () => {
  const { authModalType } = useAuthModalStore();
  const [hasAccounts, setHasAccounts] = useState(true);
  const { isConnected } = useAccount();

  return (
    <div className="m-5">
      {authModalType === "signup" ? (
        <div className="space-y-5">
          {!isConnected && <NotConnected />}
          <Signup />
        </div>
      ) : (
        <div className="space-y-5">
          {isConnected ? (
            hasAccounts ? (
              <AuthMessage
                description="Hey uses this signature to verify that you're the owner of this address."
                title="Please sign the message."
              />
            ) : (
              <SignupMessage />
            )
          ) : (
            <NotConnected isLogin />
          )}
          <Login setHasAccounts={setHasAccounts} />
        </div>
      )}
    </div>
  );
};

export default Auth;
