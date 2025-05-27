import {
  NATIVE_TOKEN_SYMBOL,
  PRO_SUBSCRIPTION_AMOUNT,
  PRO_SUBSCRIPTION_DURATION_DAYS,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import type { PlatformFeesFragment } from "@hey/indexer";

const checkProStatus = (
  post: PlatformFeesFragment
): { isPro: boolean; expiresAt?: Date } => {
  if (post.__typename !== "Post") {
    return { isPro: false };
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

  // TODO: Remove WRAPPED_NATIVE_TOKEN_SYMBOL after 30 days
  const isPro =
    daysSinceTip <= PRO_SUBSCRIPTION_DURATION_DAYS &&
    tipAmountUsd >= PRO_SUBSCRIPTION_AMOUNT &&
    (assetSymbol === NATIVE_TOKEN_SYMBOL ||
      assetSymbol === WRAPPED_NATIVE_TOKEN_SYMBOL);

  const expiresAt =
    isPro && lastSubscriptionDate
      ? new Date(
          lastSubscriptionDate.getTime() +
            PRO_SUBSCRIPTION_DURATION_DAYS * 24 * 60 * 60 * 1000
        )
      : undefined;

  return { isPro, expiresAt };
};

export default checkProStatus;
