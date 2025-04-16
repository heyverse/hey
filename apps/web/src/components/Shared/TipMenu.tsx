import TransferFundButton from "@/components/Shared/Account/Fund/FundButton";
import LoginButton from "@/components/Shared/LoginButton";
import { Button, Input, Spinner } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import {
  DEFAULT_COLLECT_TOKEN,
  DEFAULT_TOKEN,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import {
  type AccountFragment,
  type PostFragment,
  useAccountBalancesQuery,
  useExecuteAccountActionMutation,
  useExecutePostActionMutation
} from "@hey/indexer";
import type { ChangeEvent, RefObject } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const submitButtonClassName = "w-full py-1.5 text-sm font-semibold";

interface TipMenuProps {
  closePopover: () => void;
  post?: PostFragment;
  account?: AccountFragment;
}

const TipMenu = ({ closePopover, post, account }: TipMenuProps) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const { cache } = useApolloClient();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const { data: balance, loading: balanceLoading } = useAccountBalancesQuery({
    variables: { request: { tokens: [DEFAULT_COLLECT_TOKEN] } },
    pollInterval: 3000,
    skip: !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  const updateCache = () => {
    if (post) {
      if (!post.operations) {
        return;
      }

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
  };

  const onCompleted = () => {
    setIsSubmitting(false);
    closePopover();
    updateCache();
    toast.success(`Tipped ${amount} ${WRAPPED_NATIVE_TOKEN_SYMBOL}`);
  };

  const onError = (error: Error) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const cryptoRate = Number(amount);

  const erc20Balance =
    balance?.accountBalances[0].__typename === "Erc20Amount"
      ? Number(balance.accountBalances[0].value).toFixed(2)
      : 0;

  const canTip = Number(erc20Balance) >= cryptoRate;

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

  const [executeAccountAction] = useExecuteAccountActionMutation({
    onCompleted: async ({ executeAccountAction }) => {
      if (executeAccountAction.__typename === "ExecuteAccountActionResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: executeAccountAction,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const handleTip = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    const tipping = {
      currency: DEFAULT_COLLECT_TOKEN,
      value: cryptoRate.toString()
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
  };

  const amountDisabled = isSubmitting || !currentAccount;

  if (!currentAccount) {
    return <LoginButton className="m-5" title="Login to Tip" />;
  }

  return (
    <div className="m-5 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center space-x-1 text-gray-500 text-xs dark:text-gray-200">
          <span>Balance:</span>
          <span>
            {erc20Balance ? (
              `${erc20Balance} ${WRAPPED_NATIVE_TOKEN_SYMBOL}`
            ) : (
              <div className="shimmer h-2.5 w-14 rounded-full" />
            )}
          </span>
        </div>
      </div>
      <div className="space-x-4">
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(2)}
          outline={amount !== 2}
          size="sm"
        >
          $2
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(5)}
          outline={amount !== 5}
          size="sm"
        >
          $5
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(10)}
          outline={amount !== 10}
          size="sm"
        >
          $10
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => {
            handleSetAmount(other ? 2 : 20);
            setOther(!other);
          }}
          outline={!other}
          size="sm"
        >
          Other
        </Button>
      </div>
      {other ? (
        <div>
          <Input
            className="no-spinner"
            max={1000}
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
      {isSubmitting || balanceLoading ? (
        <Button
          className={cn("flex justify-center", submitButtonClassName)}
          disabled
          icon={<Spinner className="my-0.5" size="xs" />}
        />
      ) : canTip ? (
        <Button
          className={submitButtonClassName}
          disabled={!amount || isSubmitting || !canTip}
          onClick={handleTip}
        >
          <b>Tip ${amount}</b>
        </Button>
      ) : (
        <TransferFundButton className="w-full" token={DEFAULT_TOKEN} />
      )}
    </div>
  );
};

export default TipMenu;
