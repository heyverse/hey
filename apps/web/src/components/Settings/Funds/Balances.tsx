import {
  DEFAULT_COLLECT_TOKEN,
  NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import { tokens } from "@hey/data/tokens";
import { useBalancesBulkQuery } from "@hey/indexer";
import type { Address } from "viem";
import TopUpButton from "@/components/Shared/Account/TopUp/Button";
import Loader from "@/components/Shared/Loader";
import { ErrorMessage, Image } from "@/components/Shared/UI";
import getTokenImage from "@/helpers/getTokenImage";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Unwrap from "./Unwrap";
import Withdraw from "./Withdraw";
import Wrap from "./Wrap";

const Balances = () => {
  const { currentAccount } = useAccountStore();
  const { data, loading, error, refetch } = useBalancesBulkQuery({
    pollInterval: 5000,
    skip: !currentAccount?.address,
    variables: {
      request: {
        address: currentAccount?.address,
        includeNative: true,
        tokens: tokens.map((token) => token.contractAddress)
      }
    }
  });

  interface TokenBalanceProps {
    value: string;
    symbol: string;
    currency?: Address;
  }

  const TokenBalance = ({ value, symbol, currency }: TokenBalanceProps) => {
    return (
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <Image
            alt={symbol}
            className="size-5 rounded-full"
            src={getTokenImage(symbol)}
          />
          <b>{Number.parseFloat(value).toFixed(2)} </b>
          {symbol}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Withdraw currency={currency} refetch={refetch} value={value} />
          {!currency && <Wrap refetch={refetch} value={value} />}
          {currency === DEFAULT_COLLECT_TOKEN && (
            <Unwrap refetch={refetch} value={value} />
          )}
          <TopUpButton
            label="Top-up"
            outline
            size="sm"
            token={
              currency
                ? { contractAddress: currency, symbol: symbol }
                : undefined
            }
          />
        </div>
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
      {data?.balancesBulk.map((balance, index) => (
        <div key={index}>
          {balance.__typename === "NativeAmount" && (
            <TokenBalance symbol={NATIVE_TOKEN_SYMBOL} value={balance.value} />
          )}
          {balance.__typename === "Erc20Amount" && (
            <TokenBalance
              currency={balance.asset.contract.address}
              symbol={balance.asset.symbol}
              value={balance.value}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Balances;
