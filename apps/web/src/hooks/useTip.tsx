import errorToast from "@/helpers/errorToast";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import { HEY_TREASURY, NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import {
  type AccountFragment,
  type PostFragment,
  type TippingAmountInput,
  useExecuteAccountActionMutation,
  useExecutePostActionMutation
} from "@hey/indexer";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseTipProps {
  closePopover: () => void;
  post?: PostFragment;
  account?: AccountFragment;
}

const useTip = ({ closePopover, post, account }: UseTipProps) => {
  const { currentAccount } = useAccountStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const { cache } = useApolloClient();

  const updateCache = useCallback(() => {
    if (post?.operations) {
      cache.modify({
        fields: { hasTipped: () => true },
        id: cache.identify(post.operations)
      });
      cache.modify({
        fields: {
          stats: (existingData) => ({
            ...existingData,
            tips: existingData.tips + 1
          })
        },
        id: cache.identify(post)
      });
    }
  }, [cache, post]);

  const onCompleted = useCallback(
    (amount: number) => {
      setIsSubmitting(false);
      closePopover();
      updateCache();
      toast.success(`Tipped ${amount} ${NATIVE_TOKEN_SYMBOL}`);
    },
    [closePopover, updateCache]
  );

  const onError = useCallback((error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const [executePostAction] = useExecutePostActionMutation({
    onCompleted: async ({ executePostAction }) => {
      if (executePostAction.__typename === "ExecutePostActionResponse") {
        return onCompleted(lastAmountRef.current);
      }

      return await handleTransactionLifecycle({
        transactionData: executePostAction,
        onCompleted: () => onCompleted(lastAmountRef.current),
        onError
      });
    },
    onError
  });

  const [executeAccountAction] = useExecuteAccountActionMutation({
    onCompleted: async ({ executeAccountAction }) => {
      if (executeAccountAction.__typename === "ExecuteAccountActionResponse") {
        return onCompleted(lastAmountRef.current);
      }

      return await handleTransactionLifecycle({
        transactionData: executeAccountAction,
        onCompleted: () => onCompleted(lastAmountRef.current),
        onError
      });
    },
    onError
  });

  const lastAmountRef = React.useRef(0);

  const tip = useCallback(
    async (amount: number) => {
      if (!currentAccount) return;
      setIsSubmitting(true);
      lastAmountRef.current = amount;
      const tipping: TippingAmountInput = {
        referrals: [{ address: HEY_TREASURY, percent: 11 }],
        native: amount.toString()
      };

      if (post) {
        return executePostAction({
          variables: { request: { post: post.id, action: { tipping } } }
        });
      }

      if (account) {
        return executeAccountAction({
          variables: {
            request: { account: account.address, action: { tipping } }
          }
        });
      }
    },
    [currentAccount, executePostAction, executeAccountAction, post, account]
  );

  return { tip, isSubmitting };
};

export default useTip;
