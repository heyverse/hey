import { Button, Image, Spinner, Tooltip } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getTokenImage from "@/helpers/getTokenImage";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  DEFAULT_COLLECT_TOKEN,
  PERMISSIONS,
  STATIC_IMAGES_URL,
  SUBSCRIPTION_AMOUNT,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import {
  type AccountFragment,
  useBalancesBulkQuery,
  useJoinGroupMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import SingleAccount from "../Account/SingleAccount";
import TopUpButton from "../Account/TopUp/Button";

const Subscribe = () => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();

  const { data: balance, loading: balanceLoading } = useBalancesBulkQuery({
    variables: {
      request: {
        address: currentAccount?.address,
        tokens: [DEFAULT_COLLECT_TOKEN]
      }
    },
    pollInterval: 3000,
    skip: !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  const onCompleted = async (hash: string) => {
    await waitForTransactionToComplete(hash);
    location.reload();
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const tokenBalance =
    balance?.balancesBulk[0].__typename === "Erc20Amount"
      ? Number(balance.balancesBulk[0].value).toFixed(2)
      : 0;

  const canSubscribe = Number(tokenBalance) >= SUBSCRIPTION_AMOUNT;

  const [joinGroup] = useJoinGroupMutation({
    onCompleted: async ({ joinGroup }) => {
      return await handleTransactionLifecycle({
        transactionData: joinGroup,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleSubscribe = async () => {
    setIsSubmitting(true);

    return await joinGroup({
      variables: { request: { group: PERMISSIONS.SUBSCRIPTION } }
    });
  };

  const hasSubscribed = currentAccount?.hasSubscribed;

  return (
    <div className="mx-5 my-10 flex flex-col items-center gap-y-8">
      <Image
        src={`${STATIC_IMAGES_URL}/pro.png`}
        alt="Pro"
        width={128}
        className="w-32"
      />
      <div className="max-w-md text-center text-gray-500">
        {hasSubscribed ? (
          <div className="text-gray-500">
            Thanks for being a valuable <b>Hey Pro</b> member!
          </div>
        ) : (
          <>
            Join Hey Pro for for{" "}
            <b className="inline-flex items-center gap-x-1">
              {SUBSCRIPTION_AMOUNT}{" "}
              <Tooltip content={WRAPPED_NATIVE_TOKEN_SYMBOL} placement="top">
                <img
                  src={getTokenImage(WRAPPED_NATIVE_TOKEN_SYMBOL)}
                  alt={WRAPPED_NATIVE_TOKEN_SYMBOL}
                  className="size-5"
                />
              </Tooltip>
              /year
            </b>
            .
          </>
        )}
      </div>
      <SingleAccount
        account={currentAccount as AccountFragment}
        linkToAccount={false}
        showUserPreview={false}
        isVerified
      />
      {hasSubscribed ? null : (
        <>
          <div className="flex flex-col items-center gap-y-2 text-gray-500">
            <div className="flex items-center gap-x-1">
              <CheckCircleIcon className="size-4.5" />
              <span className="text-sm">Subscription Badge</span>
            </div>
            <div className="flex items-center gap-x-1">
              <CheckCircleIcon className="size-4.5" />
              <span className="text-sm">Exclusive Hey features</span>
            </div>
            <div className="flex items-center gap-x-1">
              <CheckCircleIcon className="size-4.5" />
              <span className="text-sm">Special NFT for early members</span>
            </div>
            <div className="flex items-center gap-x-1">
              <CheckCircleIcon className="size-4.5" />
              <span className="text-sm">Contribute to Hey's growth</span>
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
              Subscribe for ${SUBSCRIPTION_AMOUNT}/year
            </Button>
          ) : (
            <TopUpButton
              className="w-sm"
              label={`Top-up ${SUBSCRIPTION_AMOUNT} ${WRAPPED_NATIVE_TOKEN_SYMBOL} to your account`}
              token={{
                contractAddress: DEFAULT_COLLECT_TOKEN,
                symbol: WRAPPED_NATIVE_TOKEN_SYMBOL
              }}
              outline
            />
          )}
          <div className="-mt-1 text-center text-gray-500 text-xs">
            One-time payment. Manual renewal required next year.
          </div>
        </>
      )}
    </div>
  );
};

export default Subscribe;
