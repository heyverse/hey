import LoginButton from "@/components/Shared/LoginButton";
import { Button, Input, Spinner } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTip from "@/hooks/useTip";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import {
  type AccountFragment,
  type PostFragment,
  useAccountBalancesQuery
} from "@hey/indexer";
import type { ChangeEvent, RefObject } from "react";
import { useRef, useState } from "react";
import TopUpButton from "./Account/TopUp/Button";

const submitButtonClassName = "w-full py-1.5 text-sm font-semibold";

interface TipMenuProps {
  closePopover: () => void;
  post?: PostFragment;
  account?: AccountFragment;
}

const TipMenu = ({ closePopover, post, account }: TipMenuProps) => {
  const { currentAccount } = useAccountStore();
  const [amount, setAmount] = useState(1);
  const [other, setOther] = useState(false);
  const { tip, isSubmitting } = useTip({ closePopover, post, account });
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);

  const { data: balance, loading: balanceLoading } = useAccountBalancesQuery({
    variables: { request: { includeNative: true } },
    pollInterval: 3000,
    skip: !currentAccount?.address,
    fetchPolicy: "no-cache"
  });

  const cryptoRate = Number(amount);
  const nativeBalance =
    balance?.accountBalances[0].__typename === "NativeAmount"
      ? Number(balance.accountBalances[0].value).toFixed(2)
      : 0;
  const canTip = Number(nativeBalance) >= cryptoRate;

  const handleSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

  const handleTip = async () => {
    await tip(amount);
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
            {nativeBalance ? (
              `${nativeBalance} ${NATIVE_TOKEN_SYMBOL}`
            ) : (
              <div className="shimmer h-2.5 w-14 rounded-full" />
            )}
          </span>
        </div>
      </div>
      <div className="space-x-4">
        <Button
          disabled={amountDisabled}
          onClick={() => handleSetAmount(1)}
          outline={amount !== 1}
          size="sm"
        >
          $1
        </Button>
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
          onClick={() => {
            handleSetAmount(other ? 1 : 10);
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
            min={0}
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
        <TopUpButton className="w-full" />
      )}
    </div>
  );
};

export default TipMenu;
