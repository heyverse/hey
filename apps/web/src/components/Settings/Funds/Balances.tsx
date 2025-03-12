import { tokens } from "@hey/data/tokens";
import { useAccountBalancesQuery } from "@hey/indexer";
import { Card, CardHeader } from "@hey/ui";
import type { FC } from "react";

const Balances: FC = () => {
  const { data: balances } = useAccountBalancesQuery({
    variables: {
      request: {
        includeNative: true,
        tokens: tokens.map((token) => token.contractAddress)
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Your temporary access token" />
      <div className="m-5">
        {balances?.accountBalances.map((balance) => (
          <div key={balance.__typename}>{balance.__typename}</div>
        ))}
      </div>
    </Card>
  );
};

export default Balances;
