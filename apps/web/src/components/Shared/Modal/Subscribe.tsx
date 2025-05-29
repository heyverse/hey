import { Button, Image, Spinner, Tooltip } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getTokenImage from "@/helpers/getTokenImage";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  DEFAULT_COLLECT_TOKEN,
  STATIC_IMAGES_URL,
  SUBSCRIPTION_AMOUNT,
  SUBSCRIPTION_GROUP,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import {
  type AccountFragment,
  useAccountBalancesQuery,
  useJoinGroupMutation
} from "@hey/indexer";
import { useState } from "react";
import TransferFundButton from "../Account/Fund/FundButton";
import SingleAccount from "../Account/SingleAccount";

const Subscribe = () => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

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
      variables: { request: { group: SUBSCRIPTION_GROUP } }
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
            Get started with Hey Pro for{" "}
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
            <div className="flex items-center gap-x-1.5">
              <CheckCircleIcon className="size-5" />
              <span className="text-sm">
                Get a badge that highlights your subscription
              </span>
            </div>
            <div className="flex items-center gap-x-1.5">
              <CheckCircleIcon className="size-5" />
              <span className="text-sm">
                Unlock exclusive Hey features - no limits, no fuss
              </span>
            </div>
            <div className="flex items-center gap-x-1.5">
              <CheckCircleIcon className="size-5" />
              <span className="text-sm">
                Fuel the growth of the Hey team and platform
              </span>
            </div>
            <div className="flex items-center gap-x-1.5">
              <CheckCircleIcon className="size-5" />
              <span className="text-sm">
                Exclusive NFT for founding members
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
              Subscribe for ${SUBSCRIPTION_AMOUNT}/year
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
            One-time payment. Manual renewal required next year.
          </div>
        </>
      )}
    </div>
  );
};

export default Subscribe;
