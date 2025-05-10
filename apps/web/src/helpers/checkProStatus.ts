import { WRAPPED_NATIVE_TOKEN_SYMBOL } from "@hey/data/constants";
import type { ProFragment } from "@hey/indexer";

const PRO_TIP_AMOUNT_USD = 1;
const PRO_TIP_DAYS_SINCE_TIP = 30;

const checkProStatus = (
  post: ProFragment
): {
  isPro: boolean;
  hasIgnored: boolean;
  shouldShowRenewBanner: boolean;
} => {
  if (post.__typename !== "Post") {
    return {
      isPro: false,
      hasIgnored: false,
      shouldShowRenewBanner: false
    };
  }

  const operations = post?.operations;
  const hasIgnored = operations?.hasBookmarked ?? false;
  const lastTip = operations?.lastTip;

  const lastTipDate = lastTip?.date ? new Date(lastTip.date) : null;
  const tipAmountUsd = Number.parseFloat(lastTip?.amount?.value || "0");
  const assetSymbol = lastTip?.amount?.asset?.symbol;

  const daysSinceTip = lastTipDate
    ? (Date.now() - lastTipDate.getTime()) / (1000 * 60 * 60 * 24)
    : Number.POSITIVE_INFINITY;

  const isPro =
    !hasIgnored &&
    daysSinceTip <= PRO_TIP_DAYS_SINCE_TIP &&
    tipAmountUsd >= PRO_TIP_AMOUNT_USD &&
    assetSymbol === WRAPPED_NATIVE_TOKEN_SYMBOL;

  const shouldShowRenewBanner =
    daysSinceTip > PRO_TIP_DAYS_SINCE_TIP &&
    tipAmountUsd >= PRO_TIP_AMOUNT_USD &&
    assetSymbol === WRAPPED_NATIVE_TOKEN_SYMBOL;

  return { isPro, hasIgnored, shouldShowRenewBanner };
};

export default checkProStatus;
