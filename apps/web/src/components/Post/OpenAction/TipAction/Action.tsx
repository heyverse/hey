import FundButton from "@/components/Shared/Fund/FundButton";
import LoginButton from "@/components/Shared/LoginButton";
import { Button, Input, Spinner } from "@/components/Shared/UI";
import trackEvent from "@/helpers/analytics";
import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useApolloClient } from "@apollo/client";
import {
  DEFAULT_COLLECT_TOKEN,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type LoggedInPostOperationsFragment,
  type PostFragment,
  useExecutePostActionMutation
} from "@hey/indexer";
import type { ChangeEvent, RefObject } from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { formatUnits } from "viem";
import { useBalance } from "wagmi";

const submitButtonClassName = "w-full py-1.5 text-sm font-semibold";

interface ActionProps {
  closePopover: () => void;
  post: PostFragment;
}

const Action = ({ closePopover, post }: ActionProps) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const { cache } = useApolloClient();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: currentAccount?.address,
    query: { refetchInterval: 2000 },
    token: DEFAULT_COLLECT_TOKEN
  });

  const updateCache = () => {
    cache.modify({
      fields: { hasTipped: () => true },
      id: cache.identify(post.operations as LoggedInPostOperationsFragment)
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
  };

  const onCompleted = () => {
    setIsSubmitting(false);
    closePopover();
    updateCache();
    trackEvent(Events.Post.Tip, { amount: amount });
    toast.success(`Tipped ${amount} ${WRAPPED_NATIVE_TOKEN_SYMBOL}`);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const cryptoRate = Number(amount);

  const balance = balanceData
    ? Number.parseFloat(formatUnits(balanceData.value, 18)).toFixed(3)
    : 0;
  const canTip = Number(balance) >= cryptoRate;

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

    return executePostAction({
      variables: {
        request: {
          post: post.id,
          action: {
            tipping: {
              currency: DEFAULT_COLLECT_TOKEN,
              value: cryptoRate.toString()
            }
          }
        }
      }
    });
  };

  const amountDisabled = isSubmitting || !currentAccount;

  if (!currentAccount) {
    return <LoginButton className="m-5" title="Login to Tip" />;
  }

  return (
    <div className="m-5 space-y-3">
      <div className="space-y-2">
        <div className="ld-text-gray-500 flex items-center space-x-1 text-xs">
          <span>Balance:</span>
          <span>
            {balanceData ? (
              `${balance} ${WRAPPED_NATIVE_TOKEN_SYMBOL}`
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
        <FundButton className="w-full" />
      )}
    </div>
  );
};

export default Action;
