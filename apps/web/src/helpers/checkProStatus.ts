import { WRAPPED_NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import type { ProFragment } from "@hey/indexer";

const PRO_TIP_AMOUNT_USD = 1;
const PRO_TIP_DAYS_SINCE_TIP = 30;

const checkProStatus = (post: ProFragment): { isPro: boolean } => {
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
    daysSinceTip <= PRO_TIP_DAYS_SINCE_TIP &&
    tipAmountUsd >= PRO_TIP_AMOUNT_USD &&
    assetSymbol === WRAPPED_NATIVE_TOKEN_SYMBOL;

  return { isPro };
};

export default checkProStatus;
