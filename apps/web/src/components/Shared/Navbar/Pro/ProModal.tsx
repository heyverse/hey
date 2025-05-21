import { Button, Image, Tooltip } from "@/components/Shared/UI";
import formatDate from "@/helpers/datetime/formatDate";
import errorToast from "@/helpers/errorToast";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useProStore } from "@/store/persisted/useProStore";
import { SparklesIcon } from "@heroicons/react/24/solid";
import {
  DEFAULT_COLLECT_TOKEN,
  DEFAULT_TOKEN,
  PRO_POST_ID,
  PRO_SUBSCRIPTION_AMOUNT,
  STATIC_IMAGES_URL
} from "@hey/data/constants";
import {
  type TippingAmountInput,
  useAccountBalancesQuery,
  useExecutePostActionMutation
} from "@hey/indexer";
import { useState } from "react";
import TransferFundButton from "../../Account/Fund/FundButton";
import Loader from "../../Loader";

const ProModal = () => {
  const { currentAccount } = useAccountStore();
  const { isPro, expiresAt } = useProStore();
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

  const canSubscribe = Number(erc20Balance) >= PRO_SUBSCRIPTION_AMOUNT;

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
      value: PRO_SUBSCRIPTION_AMOUNT.toString()
    };

    return executeTipAction({
      variables: { request: { post: PRO_POST_ID, action: { tipping } } }
    });
  };

  if (balanceLoading) {
    return <Loader className="my-10" />;
  }

  return (
    <div className="m-5 flex flex-col items-center gap-y-5">
      <Image
        src={`${STATIC_IMAGES_URL}/pro.png`}
        alt="Pro"
        width={112}
        className="w-28"
      />
      {expiresAt ? (
        <div>
          Your pro expires on <b>{formatDate(expiresAt)}</b>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-y-1.5 text-gray-500 text-sm">
          <Tooltip
            content={
              <div className="flex max-w-xs items-center gap-x-1 py-1.5 leading-5">
                You will have nice <SparklesIcon className="size-4" /> icon on
                your profile
              </div>
            }
            placement="top"
          >
            <div>Pro Badge on your profile</div>
          </Tooltip>
          <Tooltip
            content={
              <div className="max-w-xs py-1.5 leading-5">
                Unlock premium collect features: customize limits, set
                timeframes, split revenue between accounts, choose licenses, and
                access exclusive tools
              </div>
            }
            placement="top"
          >
            <div>Advanced Collect</div>
          </Tooltip>
          <Tooltip
            content={
              <div className="max-w-xs py-1.5 leading-5">
                Enable monetization by allowing others to super follow your
                profile and super join your groups
              </div>
            }
            placement="top"
          >
            <div>Super Follow & Join</div>
          </Tooltip>
          <Tooltip
            content={
              <div className="max-w-xs py-1.5 leading-5">
                Host live streams and engage with your audience in real-time
              </div>
            }
            placement="top"
          >
            <div>Create Live Streams</div>
          </Tooltip>
          <div>Choose your app icon</div>
          <div>More coming soon</div>
        </div>
      )}
      {isPro ? null : canSubscribe ? (
        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Subscribe for {PRO_SUBSCRIPTION_AMOUNT} WGHO/month
        </Button>
      ) : (
        <TransferFundButton
          className="w-full"
          token={DEFAULT_TOKEN}
          label={`Transfer ${PRO_SUBSCRIPTION_AMOUNT} WGHO to your account`}
          outline
        />
      )}
      {!isPro && (
        <div className="-mt-1 text-gray-500 text-xs">
          This is not recurring. You need to manually resubscribe every month.
        </div>
      )}
    </div>
  );
};

export default ProModal;
