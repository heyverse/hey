import Loader from "@components/Shared/Loader";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { tokens } from "@hey/data/tokens";
import getTokenImage from "@hey/helpers/getTokenImage";
import { useAccountBalancesQuery, useWithdrawMutation } from "@hey/indexer";
import { Button, ErrorMessage, Image } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import usePollTransactionStatus from "src/hooks/usePollTransactionStatus";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import type { Address } from "viem";

const Balances: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();
  const pollTransactionStatus = usePollTransactionStatus();

  const { data, loading, error, refetch } = useAccountBalancesQuery({
    variables: {
      request: {
        includeNative: true,
        tokens: tokens.map((token) => token.contractAddress)
      }
    },
    pollInterval: 5000
  });

  const onCompleted = (hash: string) => {
    setIsSubmitting(false);
    trackEvent(Events.Account.WithdrawFunds);
    toast.success("Withdrawal Initiated");
    pollTransactionStatus(hash, () => {
      refetch();
      toast.success("Withdrawal Successful");
    });
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [withdraw] = useWithdrawMutation({
    onCompleted: async ({ withdraw }) => {
      if (withdraw.__typename === "InsufficientFunds") {
        return onError({ message: "Insufficient funds" });
      }

      return await handleTransactionLifecycle({
        transactionData: withdraw,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleWithdraw = (currency: Address | undefined, value: string) => {
    setIsSubmitting(true);

    return withdraw({
      variables: {
        request: {
          ...(currency ? { erc20: { currency, value } } : { native: value })
        }
      }
    });
  };

  interface TokenBalanceProps {
    value: string;
    symbol: string;
    currency?: Address;
  }

  const TokenBalance = ({ value, symbol, currency }: TokenBalanceProps) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src={getTokenImage(symbol)} alt={symbol} className="size-5" />
          <b>{Number.parseFloat(value).toFixed(2)} </b>
          {symbol}
        </div>
        <Button
          size="sm"
          outline
          onClick={() => handleWithdraw(currency, value)}
          disabled={isSubmitting}
        >
          Withdraw
        </Button>
      </div>
    );
  };

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load balances"
      />
    );
  }

  return (
    <div className="m-5 space-y-7">
      {data?.accountBalances.map((balance, index) => (
        <div key={index}>
          {balance.__typename === "NativeAmount" && (
            <TokenBalance value={balance.value} symbol={"GRASS"} />
          )}
          {balance.__typename === "Erc20Amount" && (
            <TokenBalance
              value={balance.value}
              symbol={balance.asset.symbol}
              currency={balance.asset.contract.address}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Balances;
