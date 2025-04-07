import { Button, Card, Input, Spinner } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePollTransactionStatus from "@/hooks/usePollTransactionStatus";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import {
  type FundingToken,
  useFundModalStore
} from "@/store/non-persisted/modal/useFundModalStore";
import { NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import { useDepositMutation } from "@hey/indexer";
import { type ChangeEvent, type RefObject, useRef, useState } from "react";
import toast from "react-hot-toast";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

interface FundProps {
  token?: FundingToken;
}

const Fund = ({ token }: FundProps) => {
  const { setShowFundModal } = useFundModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const { address } = useAccount();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();
  const symbol = token?.symbol ?? NATIVE_TOKEN_SYMBOL;

  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    token: token?.contractAddress,
    query: { refetchInterval: 2000 }
  });

  const onCompleted = (hash: string) => {
    setAmount(2);
    setOther(false);
    setIsSubmitting(false);
    toast.success("Deposit initiated");
    pollTransactionStatus(hash, () => {
      setShowFundModal(false);
      toast.success("Funded account successfully");
    });
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [deposit] = useDepositMutation({
    onCompleted: async ({ deposit }) => {
      if (deposit.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        transactionData: deposit,
        onCompleted,
        onError
      });
    },
    onError
  });

  const walletBalance = balance
    ? Number.parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)
    : 0;

  const onOtherAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(Number(value));
  };

  const handleSetAmount = (amount: number) => {
    setAmount(Number(amount));
    setOther(false);
  };

  const handleDeposit = async () => {
    setIsSubmitting(true);

    if (!token) {
      return await deposit({
        variables: {
          request: { native: amount.toString() }
        }
      });
    }

    return await deposit({
      variables: {
        request: {
          erc20: { currency: token.contractAddress, value: amount.toString() }
        }
      }
    });
  };

  return (
    <Card className="mt-5" forceRounded>
      <div className="mx-5 my-3 flex items-center justify-between">
        <b>Purchase</b>
        {balanceLoading ? (
          <span className="shimmer h-2.5 w-20 rounded-full" />
        ) : (
          <span className="text-gray-500 text-sm dark:text-gray-200">
            Balance: {walletBalance} {symbol}
          </span>
        )}
      </div>
      <div className="divider" />
      <div className="space-y-5 p-5">
        <div className="flex space-x-4 text-sm">
          <Button
            className="w-full"
            onClick={() => handleSetAmount(2)}
            outline={amount !== 2}
          >
            2
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSetAmount(5)}
            outline={amount !== 5}
          >
            5
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSetAmount(10)}
            outline={amount !== 10}
          >
            10
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              handleSetAmount(other ? 2 : 20);
              setOther(!other);
            }}
            outline={!other}
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
              prefix={symbol}
              placeholder="300"
              ref={inputRef}
              type="number"
              value={amount}
            />
          </div>
        ) : null}
        {balanceLoading || isSubmitting ? (
          <Button
            className="flex w-full justify-center"
            disabled
            icon={<Spinner className="my-1" size="xs" />}
          />
        ) : Number(walletBalance) < amount ? (
          <Button disabled className="w-full">
            Insufficient balance
          </Button>
        ) : (
          <Button
            disabled={amount === 0}
            className="w-full"
            onClick={handleDeposit}
          >
            Purchase {amount} {symbol}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Fund;
