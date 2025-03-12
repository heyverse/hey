import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Events } from "@hey/data/events";
import { tokens } from "@hey/data/tokens";
import getTokenImage from "@hey/helpers/getTokenImage";
import { useAccountBalancesQuery, useWithdrawMutation } from "@hey/indexer";
import { Button, Card, CardHeader, Image } from "@hey/ui";
import { type FC, useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import type { Address } from "viem";

const Balances: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransactionLifecycle = useTransactionLifecycle();

  const { data, refetch } = useAccountBalancesQuery({
    variables: {
      request: {
        includeNative: true,
        tokens: tokens.map((token) => token.contractAddress)
      }
    },
    pollInterval: 5000
  });

  const onCompleted = () => {
    setIsSubmitting(false);
    refetch();
    trackEvent(Events.Account.WithdrawFunds);
    toast.success("Withdrawal successful");
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
          onClick={() => handleWithdraw(currency, "1")}
          disabled={isSubmitting}
        >
          Withdraw
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader title="Manage account balances" />
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
    </Card>
  );
};

export default Balances;
