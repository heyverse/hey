import LoginButton from "@/components/Shared/LoginButton";
import SwapButton from "@/components/Shared/SwapButton";
import { Button, Spinner } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getCollectActionData from "@/helpers/getCollectActionData";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import { HEY_TREASURY } from "@hey/data/constants";
import {
  type PostActionFragment,
  type PostFragment,
  useExecutePostActionMutation
} from "@hey/indexer";
import { useState } from "react";
import { toast } from "sonner";
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

interface CollectActionButtonProps {
  collects: number;
  onCollectSuccess?: () => void;
  postAction: PostActionFragment;
  post: PostFragment;
}

const CollectActionButton = ({
  collects,
  onCollectSuccess = () => {},
  postAction,
  post
}: CollectActionButtonProps) => {
  const collectAction = getCollectActionData(postAction as any);
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSimpleCollected, setHasSimpleCollected] = useState(
    collectAction?.amount ? false : post.operations?.hasSimpleCollected
  );
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const endTimestamp = collectAction?.endsAt;
  const collectLimit = collectAction?.collectLimit;
  const amount = collectAction?.amount as number;
  const assetAddress = collectAction?.assetAddress as any;
  const isAllCollected = collectLimit ? collects >= collectLimit : false;
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const canCollect = !hasSimpleCollected;

  const updateCache = () => {
    if (!post.operations) {
      return;
    }

    cache.modify({
      fields: { hasSimpleCollected: () => true },
      id: cache.identify(post.operations)
    });
    cache.modify({
      fields: {
        stats: (existingData) => ({
          ...existingData,
          collects: collects + 1
        })
      },
      id: cache.identify(post)
    });
  };

  const onCompleted = () => {
    // Should not disable the button if it's a paid collect module
    setHasSimpleCollected(amount <= 0);
    setIsSubmitting(false);
    onCollectSuccess?.();
    updateCache();
    toast.success("Collected successfully");
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: assetAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [currentAccount?.owner],
    query: {
      refetchInterval: 3000,
      enabled: !assetAddress || Boolean(currentAccount?.owner)
    }
  });

  const erc20Balance =
    balance !== undefined
      ? Number(formatUnits(balance as bigint, 18)).toFixed(2)
      : 0;

  let hasAmount = false;
  if (Number(erc20Balance) < amount) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const [executeCollectAction] = useExecutePostActionMutation({
    onCompleted: async ({ executePostAction }) => {
      if (executePostAction.__typename === "ExecutePostActionResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: executePostAction,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleCreateCollect = async () => {
    setIsSubmitting(true);

    return await executeCollectAction({
      variables: {
        request: {
          post: post.id,
          action: {
            simpleCollect: {
              selected: true,
              referrals: [{ address: HEY_TREASURY, percent: 100 }]
            }
          }
        }
      }
    });
  };

  if (!currentAccount) {
    return (
      <LoginButton
        className="mt-5 w-full justify-center"
        title="Login to Collect"
      />
    );
  }

  if (balanceLoading) {
    return (
      <Button
        className="mt-5 w-full"
        disabled
        icon={<Spinner className="my-1" size="xs" />}
      />
    );
  }

  if (!canCollect) {
    return null;
  }

  if (isAllCollected || isSaleEnded) {
    return null;
  }

  if (!hasAmount) {
    return <SwapButton className="mt-5 w-full" token={assetAddress} />;
  }

  return (
    <Button
      className="mt-5 w-full justify-center"
      disabled={isSubmitting}
      loading={isSubmitting}
      onClick={handleCreateCollect}
    >
      Collect now
    </Button>
  );
};

export default CollectActionButton;
