import { Button, Image, Spinner } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signOut } from "@/store/persisted/useAuthStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  DEFAULT_COLLECT_TOKEN,
  STATIC_IMAGES_URL,
  SUBSCRIPTION_AMOUNT,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import {
  type AccountFragment,
  useAccountBalancesQuery,
  useCreateUsernameMutation
} from "@hey/indexer";
import { useState } from "react";
import TransferFundButton from "../Account/Fund/FundButton";
import SingleAccount from "../Account/SingleAccount";

const Subscribe = () => {
  const { currentAccount } = useAccountStore();
  const { resetPreferences } = usePreferencesStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const handleLogout = async () => {
    try {
      resetPreferences();
      signOut();
      location.reload();
    } catch (error) {
      errorToast(error);
    }
  };

  const { data: balance, loading: balanceLoading } = useAccountBalancesQuery({
    variables: { request: { tokens: [DEFAULT_COLLECT_TOKEN] } },
    pollInterval: 3000,
    skip: !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  const onCompleted = (hash: string) => {
    pollTransactionStatus(hash, () => location.reload());
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const erc20Balance =
    balance?.accountBalances[0].__typename === "Erc20Amount"
      ? Number(balance.accountBalances[0].value).toFixed(2)
      : 0;

  const canSubscribe = Number(erc20Balance) >= SUBSCRIPTION_AMOUNT;

  const [createUsername] = useCreateUsernameMutation({
    onCompleted: async ({ createUsername }) => {
      return await handleTransactionLifecycle({
        transactionData: createUsername,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleSubscribe = () => {
    setIsSubmitting(true);

    return createUsername({
      variables: {
        request: {
          autoAssign: true,
          username: {
            localName: `${currentAccount?.address}${new Date()
              .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              })
              .replaceAll("/", "")
              .toLowerCase()}`,
            namespace: "0x242861e7FA8704043035CD09F3d8798B1B1a1552"
          }
        }
      }
    });
  };

  return (
    <div className="mx-5 my-10 flex flex-col items-center gap-y-8">
      <Image
        src={`${STATIC_IMAGES_URL}/pro.png`}
        alt="Subscribe"
        width={112}
        className="w-28"
      />
      <div className="max-w-md text-center text-gray-500 text-sm">
        Subscribe to Hey to access the platform. A subscription is required to
        use any features and helps us keep building and improving the experience
        for everyone.
      </div>
      <SingleAccount
        account={currentAccount as AccountFragment}
        linkToAccount={false}
        showUserPreview={false}
        isVerified
      />
      <div className="flex flex-col items-center gap-y-2 text-gray-500">
        <div className="flex items-center gap-x-1.5">
          <CheckCircleIcon className="size-5" />
          <span className="text-sm">
            Get a badge that highlights your subscription
          </span>
        </div>
        <div className="flex items-center gap-x-1.5">
          <CheckCircleIcon className="size-5" />
          <span className="text-sm">
            Unlock all Hey features - no limits, no fuss
          </span>
        </div>
        <div className="flex items-center gap-x-1.5">
          <CheckCircleIcon className="size-5" />
          <span className="text-sm">
            Fuel the growth of the Hey team and platform
          </span>
        </div>
      </div>
      {balanceLoading ? (
        <Button
          className="w-sm"
          disabled
          icon={<Spinner className="my-1" size="xs" />}
        />
      ) : canSubscribe ? (
        <Button
          className="w-sm"
          onClick={handleSubscribe}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Subscribe for {SUBSCRIPTION_AMOUNT} {WRAPPED_NATIVE_TOKEN_SYMBOL}/year
        </Button>
      ) : (
        <TransferFundButton
          className="w-sm"
          label={`Transfer ${SUBSCRIPTION_AMOUNT} ${WRAPPED_NATIVE_TOKEN_SYMBOL} to your account`}
          token={{
            contractAddress: DEFAULT_COLLECT_TOKEN,
            symbol: WRAPPED_NATIVE_TOKEN_SYMBOL
          }}
          outline
        />
      )}
      <div className="-mt-1 text-center text-gray-500 text-xs">
        <button className="underline" type="button" onClick={handleLogout}>
          Logout
        </button>{" "}
        and try with different account
      </div>
    </div>
  );
};

export default Subscribe;
