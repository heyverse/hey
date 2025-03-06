import Fund from "@components/Shared/Fund/FundAccount/Fund";
import Loader from "@components/Shared/Loader";
import { BLOCK_EXPLORER_URL, HEY_SPONSOR } from "@hey/data/constants";
import { Card, CardHeader, ErrorMessage, NumberedStat } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { formatEther } from "viem";
import { useBalance } from "wagmi";

const Sponsorship: FC = () => {
  const { data, isLoading, error } = useBalance({
    address: HEY_SPONSOR,
    query: { refetchInterval: 2000 }
  });

  return (
    <Card>
      <CardHeader title="Sponsorship" />
      <div className="m-5">
        {isLoading ? (
          <Loader className="my-10" message="Loading sponsorship..." />
        ) : error ? (
          <ErrorMessage error={error} title="Failed to load sponsorship" />
        ) : (
          <div className="space-y-5">
            <div className="linkify font-bold">
              <Link
                href={`${BLOCK_EXPLORER_URL}/address/${HEY_SPONSOR}`}
                target="_blank"
              >
                Open Sponsorship Contract in Explorer
              </Link>
            </div>
            <NumberedStat
              count={formatEther(data?.value || BigInt(0))}
              name="Sponsorship Balance"
              suffix="GHO"
            />
            <Fund recipient={HEY_SPONSOR} useNativeToken />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Sponsorship;
