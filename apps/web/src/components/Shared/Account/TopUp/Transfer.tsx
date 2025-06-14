import { Button, Card, Input, Spinner } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import useWaitForTransactionToComplete from "@/hooks/useWaitForTransactionToComplete";
import {
  type FundingToken,
  useFundModalStore
} from "@/store/non-persisted/modal/useFundModalStore";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { NATIVE_TOKEN_SYMBOL, NULL_ADDRESS } from "@hey/data/constants";
import { useBalancesBulkQuery, useDepositMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { type ChangeEvent, type RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

interface TransferProps {
  token?: FundingToken;
}

const Transfer = ({ token }: TransferProps) => {
  const { setShowFundModal } = useFundModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(1);
  const [other, setOther] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const { address } = useAccount();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const waitForTransactionToComplete = useWaitForTransactionToComplete();
  const symbol = token?.symbol ?? NATIVE_TOKEN_SYMBOL;

  const { data: balance, loading: balanceLoading } = useBalancesBulkQuery({
    variables: {
      request: {
        address,
        ...(token
          ? { tokens: [token?.contractAddress] }
          : { includeNative: true })
      }
    },
    pollInterval: 3000,
    skip: !address,
    fetchPolicy: "no-cache"
  });

  const onCompleted = async (hash: string) => {
    setAmount(2);
    setOther(false);
    await waitForTransactionToComplete(hash);
    setIsSubmitting(false);
    setShowFundModal(false);
    toast.success("Transferred successfully");
  };

  const onError = (error: ApolloClientError) => {
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

  const tokenBalance =
    balance?.balancesBulk[0].__typename === "Erc20Amount"
      ? Number(balance.balancesBulk[0].value).toFixed(2)
      : balance?.balancesBulk[0].__typename === "NativeAmount"
        ? Number(balance.balancesBulk[0].value).toFixed(2)
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
            Balance: {tokenBalance} {symbol}
          </span>
        )}
      </div>
      <div className="divider" />
      <div className="space-y-5 p-5">
        <div className="flex space-x-4 text-sm">
          <Button
            className="w-full"
            onClick={() => handleSetAmount(1)}
            outline={amount !== 1}
          >
            1
          </Button>
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
            onClick={() => {
              handleSetAmount(other ? 1 : 10);
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
        {balanceLoading ? (
          <Button
            className="flex w-full justify-center"
            disabled
            icon={<Spinner className="my-1" size="xs" />}
          />
        ) : Number(tokenBalance) < amount ? (
          <Button
            onClick={() => {
              const params = new URLSearchParams({
                utm_source: "hey.xyz",
                utm_medium: "sites",
                isExactOut: "false",
                inputChain: "lens",
                outToken: token?.contractAddress ?? NULL_ADDRESS
              });

              window.open(`https://oku.trade/?${params.toString()}`, "_blank");
            }}
            className="w-full"
          >
            <span>Buy on Oku.trade</span>
            <ArrowUpRightIcon className="size-4" />
          </Button>
        ) : (
          <Button
            disabled={isSubmitting || amount === 0}
            loading={isSubmitting}
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

export default Transfer;
