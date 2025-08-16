import { useApolloClient } from "@apollo/client";
import { HEY_TREASURY } from "@hey/data/constants";
import {
  type PostFragment,
  type SimpleCollectActionFragment,
  useBalancesBulkQuery,
  useExecutePostActionMutation
} from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Address } from "viem";
import TopUpButton from "@/components/Shared/Account/TopUp/Button";
import LoginButton from "@/components/Shared/LoginButton";
import { Button, Spinner } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import getCollectActionData from "@/helpers/getCollectActionData";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface CollectActionButtonProps {
  collects: number;
  onCollectSuccess?: () => void;
  postAction: SimpleCollectActionFragment;
  post: PostFragment;
}

const CollectActionButton = ({
  collects,
  onCollectSuccess = () => {},
  postAction,
  post
}: CollectActionButtonProps) => {
  const collectAction = getCollectActionData(postAction);
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSimpleCollected, setHasSimpleCollected] = useState(
    collectAction?.price ? false : post.operations?.hasSimpleCollected
  );
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const endTimestamp = collectAction?.endsAt;
  const collectLimit = collectAction?.collectLimit;
  const amount = collectAction?.price as number;
  const assetAddress = collectAction?.assetAddress as Address | undefined;
  const assetSymbol = collectAction?.assetSymbol as string;
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

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const { data: balance, loading: balanceLoading } = useBalancesBulkQuery({
    fetchPolicy: "no-cache",
    pollInterval: 3000,
    skip: !assetAddress || !currentAccount?.address,
    variables: {
      request: { address: currentAccount?.address, tokens: [assetAddress] }
    }
  });

  const tokenBalance =
    balance?.balancesBulk[0].__typename === "Erc20Amount"
      ? balance.balancesBulk[0].value
      : 0;

  let hasAmount = false;
  if (Number.parseFloat(tokenBalance) < amount) {
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
        onCompleted,
        onError,
        transactionData: executePostAction
      });
    },
    onError
  });

  const handleCreateCollect = async () => {
    setIsSubmitting(true);

    return await executePostAction({
      variables: {
        request: {
          action: {
            simpleCollect: {
              referrals: [{ address: HEY_TREASURY, percent: 100 }],
              selected: true
            }
          },
          post: post.id
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
    return (
      <TopUpButton
        amountToTopUp={Math.ceil((amount - Number(tokenBalance)) * 20) / 20}
        className="mt-5 w-full"
        token={{
          contractAddress: assetAddress as Address,
          symbol: assetSymbol
        }}
      />
    );
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
