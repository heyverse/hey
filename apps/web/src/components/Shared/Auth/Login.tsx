import { Button, Card, ErrorMessage } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { signIn } from "@/store/persisted/useAuthStore";
import { KeyIcon } from "@heroicons/react/24/outline";
import { HEY_APP, IS_MAINNET } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import {
  type ChallengeRequest,
  useAccountsAvailableQuery,
  useAuthenticateMutation,
  useChallengeMutation
} from "@hey/indexer";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import SingleAccount from "../Account/SingleAccount";
import Loader from "../Loader";
import SignupCard from "./SignupCard";
import WalletSelector from "./WalletSelector";

interface LoginProps {
  setHasAccounts: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ setHasAccounts }: LoginProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggingInAccountId, setLoggingInAccountId] = useState<null | string>(
    null
  );

  const onError = (error?: any) => {
    setIsSubmitting(false);
    setLoggingInAccountId(null);
    errorToast(error);
  };

  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ mutation: { onError } });
  const [loadChallenge, { error: errorChallenge }] = useChallengeMutation({
    onError
  });
  const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation({
    onError
  });

  const { data, loading } = useAccountsAvailableQuery({
    onCompleted: (data) =>
      setHasAccounts(data?.accountsAvailable.items.length > 0),
    skip: !address,
    variables: {
      accountsAvailableRequest: { managedBy: address },
      lastLoggedInAccountRequest: { address }
    }
  });

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

  const handleSign = async (account: string) => {
    const isManager = allProfiles.some(
      ({ account: a, __typename }) =>
        __typename === "AccountManaged" && a.address === account
    );

    const meta = { app: IS_MAINNET ? HEY_APP : undefined, account };
    const request: ChallengeRequest = isManager
      ? { accountManager: { manager: address, ...meta } }
      : { accountOwner: { owner: address, ...meta } };

    try {
      setLoggingInAccountId(account || null);
      setIsSubmitting(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request }
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
        return location.reload();
      }

      return onError({ message: Errors.SomethingWentWrong });
    } catch {
      onError();
    }
  };

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
        {loading ? (
          <Card className="w-full dark:divide-gray-700" forceRounded>
            <Loader
              className="my-4"
              message="Loading accounts managed by you..."
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
                  loading={
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
