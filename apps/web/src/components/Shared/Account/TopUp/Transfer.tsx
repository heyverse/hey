import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import { useBalancesBulkQuery, useDepositMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import {
  type ChangeEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { toast } from "sonner";
import { type Hex, zeroAddress } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import Skeleton from "@/components/Shared/Skeleton";
import { Button, Card, Input, Spinner } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import usePreventScrollOnNumberInput from "@/hooks/usePreventScrollOnNumberInput";
import useTransactionLifecycle from "@/hooks/useTransactionLifecycle";
import {
  type FundingToken,
  useFundModalStore
} from "@/store/non-persisted/modal/useFundModalStore";

interface TransferProps {
  token?: FundingToken;
}

const Transfer = ({ token }: TransferProps) => {
  const { setShowFundModal, amountToTopUp } = useFundModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [amount, setAmount] = useState(amountToTopUp ?? 1);
  const [other, setOther] = useState(!!amountToTopUp);
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef as RefObject<HTMLInputElement>);
  const { address } = useAccount();
  const handleTransactionLifecycle = useTransactionLifecycle();
  const symbol = token?.symbol ?? NATIVE_TOKEN_SYMBOL;

  const { data: balance, loading: balanceLoading } = useBalancesBulkQuery({
    fetchPolicy: "no-cache",
    pollInterval: 3000,
    skip: !address,
    variables: {
      request: {
        address,
        ...(token
          ? { tokens: [token?.contractAddress] }
          : { includeNative: true })
      }
    }
  });

  const onCompleted = async () => {
    setAmount(2);
    setOther(false);
    setIsSubmitting(false);
    setTxHash(null);
    setShowFundModal({ showFundModal: false });
    toast.success("Transferred successfully");
  };

  const onError = useCallback((error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  }, []);

  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: txHash as Hex,
    query: { enabled: Boolean(txHash) }
  });

  useEffect(() => {
    if (transactionReceipt?.status === "success") {
      onCompleted();
    }
  }, [transactionReceipt]);

  const [deposit] = useDepositMutation({
    onCompleted: async ({ deposit }) => {
      if (deposit.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        onCompleted: (hash) => setTxHash(hash as Hex),
        onError,
        transactionData: deposit
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
    const value = Number(event.target.value);
    setAmount(value);
  };

  const handleSetAmount = (amount: number) => {
    setAmount(Number(amount));
    setOther(false);
  };

  const buildDepositRequest = (amount: number, token?: FundingToken) => {
    if (!token) {
      return { native: amount.toString() };
    }

    return {
      erc20: {
        currency: token.contractAddress,
        value: amount.toString()
      }
    };
  };

  const handleDeposit = async () => {
    setIsSubmitting(true);
    return await deposit({
      variables: { request: buildDepositRequest(amount, token) }
    });
  };

  return (
    <Card className="mt-5" forceRounded>
      <div className="mx-5 my-3 flex items-center justify-between">
        <b>Purchase</b>
        {balanceLoading ? (
          <Skeleton className="h-2.5 w-20 rounded-full" />
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
              placeholder="300"
              prefix={symbol}
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
            className="w-full"
            onClick={() => {
              const params = new URLSearchParams({
                inputChain: "lens",
                isExactOut: "false",
                outToken: token?.contractAddress ?? zeroAddress,
                utm_medium: "sites",
                utm_source: "hey.xyz"
              });

              window.open(`https://oku.trade/?${params.toString()}`, "_blank");
            }}
          >
            <span>Buy on Oku.trade</span>
            <ArrowUpRightIcon className="size-4" />
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={isSubmitting || amount === 0}
            loading={isSubmitting}
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
