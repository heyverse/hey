import {
  NATIVE_TOKEN_SYMBOL,
  SUBSCRIPTION_AMOUNT,
  SUBSCRIPTION_DURATION_DAYS
} from "@hey/data/constants";
import type { PlatformFeesFragment } from "@hey/indexer";

const checkSubscriptionStatus = (
  post: PlatformFeesFragment
): { hasSubscribed: boolean; expiresAt?: Date } => {
  if (post.__typename !== "Post") {
    return { hasSubscribed: false };
  }

  const operations = post?.operations;
  const lastSubscription = operations?.lastSubscription;

  const lastSubscriptionDate = lastSubscription?.date
    ? new Date(lastSubscription.date)
    : null;
  const tipAmountUsd = Number.parseFloat(
    lastSubscription?.tipAmount?.value || "0"
  );
  const assetSymbol = lastSubscription?.tipAmount?.asset?.symbol;

  const daysSinceTip = lastSubscriptionDate
    ? (Date.now() - lastSubscriptionDate.getTime()) / (1000 * 60 * 60 * 24)
    : Number.POSITIVE_INFINITY;

  const hasSubscribed =
    daysSinceTip <= SUBSCRIPTION_DURATION_DAYS &&
    tipAmountUsd >= SUBSCRIPTION_AMOUNT &&
    assetSymbol === NATIVE_TOKEN_SYMBOL;

  const expiresAt =
    hasSubscribed && lastSubscriptionDate
      ? new Date(
          lastSubscriptionDate.getTime() +
            SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000
        )
      : undefined;

  return { hasSubscribed, expiresAt };
};

export default checkSubscriptionStatus;
