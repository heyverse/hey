import { KeyIcon } from "@heroicons/react/24/outline";
import { HEY_APP, IS_MAINNET } from "@hey/data/constants";
import { ERRORS } from "@hey/data/errors";
import {
  type ChallengeRequest,
  ManagedAccountsVisibility,
  useAccountsAvailableQuery,
  useAuthenticateMutation,
  useChallengeMutation
} from "@hey/indexer";
import { AnimatePresence, motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { Button, Card, ErrorMessage } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import reloadAllTabs from "@/helpers/reloadAllTabs";
import { signIn } from "@/store/persisted/useAuthStore";
import { EXPANSION_EASE } from "@/variants";
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
  const [isExpanded, setIsExpanded] = useState(true);

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
    onCompleted: (data) => {
      setHasAccounts(data?.accountsAvailable.items.length > 0);
      setIsExpanded(true);
    },
    skip: !address,
    variables: {
      accountsAvailableRequest: {
        hiddenFilter: ManagedAccountsVisibility.NoneHidden,
        managedBy: address
      },
      lastLoggedInAccountRequest: { address }
    }
  });

  const allAccounts = data?.accountsAvailable.items || [];
  const lastLogin = data?.lastLoggedInAccount;

  const remainingAccounts = lastLogin
    ? allAccounts
        .filter(({ account }) => account.address !== lastLogin.address)
        .map(({ account }) => account)
    : allAccounts.map(({ account }) => account);

  const accounts = lastLogin
    ? [lastLogin, ...remainingAccounts]
    : remainingAccounts;

  const handleSign = async (account: string) => {
    const isManager = allAccounts.some(
      ({ account: a, __typename }) =>
        __typename === "AccountManaged" && a.address === account
    );

    const meta = { account, app: IS_MAINNET ? HEY_APP : undefined };
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
        return toast.error(ERRORS.SomethingWentWrong);
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
        signIn({ accessToken, refreshToken });
        reloadAllTabs();
        return;
      }

      return onError({ message: ERRORS.SomethingWentWrong });
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
            error={errorChallenge || errorAuthenticate}
            title={ERRORS.SomethingWentWrong}
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
          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                animate="visible"
                initial="hidden"
                variants={{
                  hidden: { height: 0, opacity: 0, overflow: "hidden" },
                  visible: {
                    height: "auto",
                    opacity: 1,
                    transition: { duration: 0.2, ease: EXPANSION_EASE }
                  }
                }}
              >
                <Card
                  className="max-h-[50vh] w-full overflow-y-auto dark:divide-gray-700"
                  forceRounded
                >
                  {accounts.map((account, index) => (
                    <motion.div
                      className="flex items-center justify-between p-3"
                      custom={index}
                      key={account.address}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          transition: { duration: 0.1 },
                          y: 0
                        }
                      }}
                      whileHover={{
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <SingleAccount
                        account={account}
                        hideFollowButton
                        hideUnfollowButton
                        linkToAccount={false}
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
                    </motion.div>
                  ))}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
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
