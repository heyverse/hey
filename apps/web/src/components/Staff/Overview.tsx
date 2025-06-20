import Loader from "@/components/Shared/Loader";
import NumberedStat from "@/components/Shared/NumberedStat";
import { Card, CardHeader, ErrorMessage } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  DEFAULT_COLLECT_TOKEN,
  PERMISSIONS,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import { useProStatsQuery } from "@hey/indexer";

const Overview = () => {
  const { currentAccount } = useAccountStore();

  const { data, error, loading } = useProStatsQuery({
    variables: {
      groupStatsRequest: { group: PERMISSIONS.SUBSCRIPTION },
      balancesBulkRequest: {
        address: currentAccount?.owner,
        tokens: [DEFAULT_COLLECT_TOKEN]
      }
    },
    pollInterval: 3000
  });

  if (loading) {
    return (
      <Card>
        <Loader className="my-10" />
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load pro stats" />;
  }

  return (
    <Card>
      <CardHeader title="Stats" />
      <div className="flex flex-col gap-3 p-5">
        <NumberedStat
          count={
            data?.balancesBulk?.[0]?.__typename === "Erc20Amount"
              ? Number.parseFloat(data?.balancesBulk?.[0]?.value).toFixed(2)
              : "N/A"
          }
          name="Total Balance"
          suffix={WRAPPED_NATIVE_TOKEN_SYMBOL}
        />
        <NumberedStat
          count={data?.groupStats?.totalMembers?.toString()}
          name="Total Pro Members"
          suffix="members"
        />
      </div>
    </Card>
  );
};

export default Overview;
