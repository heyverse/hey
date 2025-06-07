import { ErrorMessage, Spinner, WarningMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signIn, signOut } from "@/store/persisted/useAuthStore";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import {
  ManagedAccountsVisibility,
  useAccountsAvailableQuery,
  useSwitchAccountMutation
} from "@hey/indexer";
import { useState } from "react";
import { useAccount } from "wagmi";
import Loader from "../Loader";
import SmallSingleAccount from "./SmallSingleAccount";

const SwitchAccounts = () => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggingInAccountId, setLoggingInAccountId] = useState<null | string>(
    null
  );
  const { address } = useAccount();

  const onError = (error?: any) => {
    setIsSubmitting(false);
    setLoggingInAccountId(null);
    errorToast(error);
  };

  const { data, error, loading } = useAccountsAvailableQuery({
    variables: {
      lastLoggedInAccountRequest: { address: address },
      accountsAvailableRequest: {
        managedBy: address,
        hiddenFilter: ManagedAccountsVisibility.NoneHidden
      }
    },
    skip: !address
  });
  const [switchAccount] = useSwitchAccountMutation();

  if (!address) {
    return (
      <WarningMessage
        className="m-5"
        title="No wallet connected"
        message="Connect your wallet to switch accounts"
      />
    );
  }

  if (loading) {
    return <Loader className="my-5" message="Loading Accounts" />;
  }

  const accountsAvailable = data?.accountsAvailable.items || [];

  const handleSwitchAccount = async (account: string) => {
    try {
      setLoggingInAccountId(account);
      setIsSubmitting(true);

      const auth = await switchAccount({ variables: { request: { account } } });

      if (auth.data?.switchAccount.__typename === "AuthenticationTokens") {
        const accessToken = auth.data?.switchAccount.accessToken;
        const refreshToken = auth.data?.switchAccount.refreshToken;
        signOut();
        signIn({ accessToken, refreshToken });
        return location.reload();
      }

      return onError({ message: Errors.SomethingWentWrong });
    } catch {
      onError();
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-2">
      <ErrorMessage
        className="m-2"
        error={error}
        title="Failed to load accounts"
      />
      {accountsAvailable.map((accountAvailable, index) => (
        <button
          className="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-lg py-3 pr-4 pl-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          key={accountAvailable?.account.address}
          onClick={async () => {
            const selectedAccount = accountsAvailable[index].account;
            await handleSwitchAccount(selectedAccount.address);
          }}
          type="button"
        >
          <div
            className={cn(
              currentAccount?.address === accountAvailable.account.address &&
                "font-bold"
            )}
          >
            <SmallSingleAccount account={accountAvailable.account} />
          </div>
          {isSubmitting &&
          accountAvailable.account.address === loggingInAccountId ? (
            <Spinner size="xs" />
          ) : currentAccount?.address === accountAvailable.account.address ? (
            <CheckCircleIcon className="size-5 text-green-500" />
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default SwitchAccounts;
