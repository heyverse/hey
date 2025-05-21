import { Button, Image } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  DEFAULT_COLLECT_TOKEN,
  STATIC_IMAGES_URL,
  SUBSCRIPTION_AMOUNT,
  SUBSCRIPTION_POST_ID
} from "@hey/data/constants";
import {
  type TippingAmountInput,
  useExecutePostActionMutation
} from "@hey/indexer";
import { useState } from "react";
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import Loader from "../Loader";
import SwapButton from "../SwapButton";

const Subscribe = () => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: DEFAULT_COLLECT_TOKEN,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [currentAccount?.owner],
    query: { refetchInterval: 3000, enabled: Boolean(currentAccount?.owner) }
  });

  const onCompleted = (hash: string) => {
    pollTransactionStatus(hash, () => location.reload());
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const erc20Balance =
    balance !== undefined
      ? Number(formatUnits(balance as bigint, 18)).toFixed(2)
      : 0;

  const canSubscribe = Number(erc20Balance) >= SUBSCRIPTION_AMOUNT;

  const [executeTipAction] = useExecutePostActionMutation({
    onCompleted: async ({ executePostAction }) => {
      if (executePostAction.__typename === "ExecutePostActionResponse") {
        return onCompleted(executePostAction.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: executePostAction,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleSubscribe = () => {
    setIsSubmitting(true);

    const tipping: TippingAmountInput = {
      currency: DEFAULT_COLLECT_TOKEN,
      value: SUBSCRIPTION_AMOUNT.toString()
    };

    return executeTipAction({
      variables: {
        request: { post: SUBSCRIPTION_POST_ID, action: { tipping } }
      }
    });
  };

  if (balanceLoading) {
    return <Loader className="my-10" />;
  }

  return (
    <div className="mx-5 my-10 flex flex-col items-center gap-y-8">
      <Image
        src={`${STATIC_IMAGES_URL}/pro.png`}
        alt="Subscribe"
        width={144}
        className="w-36"
      />
      <div className="max-w-md text-center text-gray-500 text-sm">
        Subscribe to Hey to access the platform. A subscription is required to
        use any features and helps us keep building and improving the experience
        for everyone.
      </div>
      {canSubscribe ? (
        <Button
          className="w-sm"
          onClick={handleSubscribe}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Subscribe for {SUBSCRIPTION_AMOUNT} WGHO/year
        </Button>
      ) : (
        <SwapButton
          className="w-sm"
          token={DEFAULT_COLLECT_TOKEN}
          label={`Transfer ${SUBSCRIPTION_AMOUNT} WGHO to your account`}
          outline
        />
      )}
      <div className="-mt-1 text-gray-500 text-xs">
        This is not recurring. You need to manually resubscribe every year.
      </div>
    </div>
  );
};

export default Subscribe;
