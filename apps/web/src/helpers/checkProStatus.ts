import {
  PRO_SUBSCRIPTION_AMOUNT,
  PRO_SUBSCRIPTION_DURATION_DAYS,
  WRAPPED_NATIVE_TOKEN_SYMBOL
} from "@hey/data/constants";
import type { ProFragment } from "@hey/indexer";

const checkProStatus = (
  post: ProFragment
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
    lastSubscription?.amount?.value || "0"
  );
  const assetSymbol = lastSubscription?.amount?.asset?.symbol;

  const daysSinceTip = lastSubscriptionDate
    ? (Date.now() - lastSubscriptionDate.getTime()) / (1000 * 60 * 60 * 24)
    : Number.POSITIVE_INFINITY;

  const isPro =
    daysSinceTip <= PRO_SUBSCRIPTION_DURATION_DAYS &&
    tipAmountUsd >= PRO_SUBSCRIPTION_AMOUNT &&
    assetSymbol === WRAPPED_NATIVE_TOKEN_SYMBOL;

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
