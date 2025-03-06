import Loader from "@components/Shared/Loader";
import { BLOCK_EXPLORER_URL, HEY_APP, HEY_TREASURY } from "@hey/data/constants";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { formatEther } from "viem";
import { useBalance } from "wagmi";

const App: FC = () => {
  const { data, isLoading, error } = useBalance({
    address: HEY_TREASURY,
    query: { refetchInterval: 2000 }
  });

  return (
    <Card>
      <CardHeader title="App" />
      {isLoading ? (
        <Loader className="my-10" message="Loading App..." />
      ) : error ? (
        <ErrorMessage error={error} title="Failed to load App" />
      ) : (
        <div className="m-5">
          <div className="space-y-5">
            <div className="linkify font-bold">
              <Link
                href={`${BLOCK_EXPLORER_URL}/address/${HEY_APP}`}
                target="_blank"
              >
                Open App Contract in Explorer
              </Link>
            </div>
            <NumberedStat
              count={formatEther(data?.value || BigInt(0))}
              name="Treasury Balance"
              suffix="GHO"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default App;
