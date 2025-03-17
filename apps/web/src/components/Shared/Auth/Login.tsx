import SwitchNetwork from "@components/Shared/SwitchNetwork";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { KeyIcon } from "@heroicons/react/24/outline";
import { HEY_APP } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  useAccountsAvailableQuery,
  useAuthenticateMutation,
  useChallengeMutation
} from "@hey/indexer";
import { Button, Card, ErrorMessage } from "@hey/ui";
import { useRouter } from "next/router";
import type { Dispatch, FC, SetStateAction } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CHAIN } from "src/constants";
import { signIn } from "src/store/persisted/useAuthStore";
import { useAccount, useChainId, useDisconnect, useSignMessage } from "wagmi";
import Loader from "../Loader";
import SingleAccount from "../SingleAccount";
import SignupCard from "./SignupCard";
import WalletSelector from "./WalletSelector";

interface LoginProps {
  setHasAccounts: Dispatch<SetStateAction<boolean>>;
}

const Login: FC<LoginProps> = ({ setHasAccounts }) => {
  const { reload } = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggingInAccountId, setLoggingInAccountId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const chain = useChainId();
  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ mutation: { onError } });
  const [loadChallenge, { error: errorChallenge }] = useChallengeMutation();
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();

  const { data, loading } = useAccountsAvailableQuery({
    onCompleted: (data) =>
      setHasAccounts(data?.accountsAvailable.items.length > 0),
    skip: !address,
    variables: {
      accountsAvailableRequest: { managedBy: address },
      lastLoggedInAccountRequest: { address }
    }
  });

  const handleSign = async (account: string) => {
    try {
      setLoggingInAccountId(account || null);
      setIsSubmitting(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: {
          request: { accountOwner: { app: HEY_APP, owner: address, account } }
        }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth account
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });

      if (auth.data?.authenticate.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.authenticate.accessToken;
        const refreshToken = auth.data?.authenticate.refreshToken;
        const idToken = auth.data?.authenticate.idToken;
        signIn({ accessToken, idToken, refreshToken });
        trackEvent(Events.Account.Login);
        return reload();
      }

      return toast.error(Errors.SomethingWentWrong);
    } catch {
      setIsSubmitting(false);
    }
  };

  const allProfiles = data?.accountsAvailable.items || [];
  const lastLogin = data?.lastLoggedInAccount;

  const remainingProfiles = lastLogin
    ? allProfiles
        .filter(({ account }) => account.address !== lastLogin.address)
        .map(({ account }) => account)
    : allProfiles.map(({ account }) => account);

  const accounts = lastLogin
    ? [lastLogin, ...remainingProfiles]
    : remainingProfiles;

  return activeConnector?.id ? (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {errorChallenge || errorAuthenticate ? (
          <ErrorMessage
            className="text-red-500"
            title={Errors.SomethingWentWrong}
            error={errorChallenge || errorAuthenticate}
          />
        ) : null}
        {chain === CHAIN.id ? (
          loading ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              <Loader
                className="my-4"
                message="Loading profiles managed by you..."
                small
              />
            </Card>
          ) : accounts.length > 0 ? (
            <Card
              className="max-h-[50vh] w-full overflow-y-auto dark:divide-gray-700"
              forceRounded
            >
              {accounts.map((account) => (
                <div
                  className="flex items-center justify-between p-3"
                  key={account.address}
                >
                  <SingleAccount
                    hideFollowButton
                    hideUnfollowButton
                    linkToAccount={false}
                    account={account}
                    showUserPreview={false}
                  />
                  <Button
                    disabled={
                      isSubmitting && loggingInAccountId === account.address
                    }
                    onClick={() => handleSign(account.address)}
                    outline
                  >
                    Login
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <SignupCard />
          )
        ) : (
          <SwitchNetwork toChainId={CHAIN.id} />
        )}
        <button
          className="flex items-center space-x-1 text-sm underline"
          onClick={() => disconnect?.()}
          type="reset"
        >
          <KeyIcon className="size-4" />
          <div>Change wallet</div>
        </button>
      </div>
    </div>
  ) : (
    <WalletSelector />
  );
};

export default Login;
