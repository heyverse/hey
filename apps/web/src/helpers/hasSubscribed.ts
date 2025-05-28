import { SUBSCRIPTION_DURATION_DAYS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";

const hasSubscribed = (account: AccountFragment): boolean => {
  const lastSubscriptionDate = account?.subscription?.timestamp
    ? new Date(account?.subscription.timestamp)
    : undefined;

  const daysSinceTip = lastSubscriptionDate
    ? (Date.now() - lastSubscriptionDate.getTime()) / (1000 * 60 * 60 * 24)
    : Number.POSITIVE_INFINITY;

  const hasSubscribed = daysSinceTip <= SUBSCRIPTION_DURATION_DAYS;

  return hasSubscribed;
};

export default hasSubscribed;
