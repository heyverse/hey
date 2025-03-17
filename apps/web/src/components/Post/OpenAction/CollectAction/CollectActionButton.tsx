import { useApolloClient } from "@apollo/client";
import LoginButton from "@components/Shared/LoginButton";
import NoBalanceError from "@components/Shared/NoBalanceError";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { HEY_TREASURY } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import getCollectActionData from "@hey/helpers/getCollectActionData";
import {
  type LoggedInPostOperationsFragment,
  type PostActionFragment,
  type PostFragment,
  useExecutePostActionMutation
} from "@hey/indexer";
import { Button, WarningMessage } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { type Address, formatUnits } from "viem";
import { useBalance } from "wagmi";

interface CollectActionButtonProps {
  collects: number;
  onCollectSuccess?: () => void;
  postAction: PostActionFragment;
  post: PostFragment;
}

const CollectActionButton: FC<CollectActionButtonProps> = ({
  collects,
  onCollectSuccess = () => {},
  postAction,
  post
}) => {
  const collectAction = getCollectActionData(postAction as any);
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
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
  const assetDecimals = collectAction?.assetDecimals as number;
  const isAllCollected = collectLimit ? collects >= collectLimit : false;
  const isSaleEnded = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;
  const canCollect = !hasSimpleCollected;

  const updateCache = () => {
    cache.modify({
      fields: { hasSimpleCollected: () => true },
      id: cache.identify(post.operations as LoggedInPostOperationsFragment)
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
    trackEvent(Events.Post.Collect, {
      amount: amount,
      currency: collectAction?.assetSymbol
    });
    toast.success("Collected successfully");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const { data: balanceData } = useBalance({
    address: currentAccount?.address as Address,
    query: { refetchInterval: 2000 },
    token: assetAddress
  });

  let hasAmount = false;
  if (
    balanceData &&
    Number.parseFloat(formatUnits(balanceData.value, assetDecimals)) < amount
  ) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const [executePostAction] = useExecutePostActionMutation({
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
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    return await executePostAction({
      variables: {
        request: {
          post: post.id,
          action: {
            simpleCollect: {
              selected: true,
              referrals: [{ address: HEY_TREASURY, percent: 5 }]
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

  if (!canCollect) {
    return null;
  }

  if (isAllCollected || isSaleEnded) {
    return null;
  }

  if (!hasAmount) {
    return (
      <WarningMessage
        className="mt-5 w-full"
        message={<NoBalanceError assetSymbol={collectAction?.assetSymbol} />}
      />
    );
  }

  return (
    <Button
      className="mt-5 w-full justify-center"
      disabled={isSubmitting}
      onClick={handleCreateCollect}
    >
      Collect now
    </Button>
  );
};

export default CollectActionButton;
