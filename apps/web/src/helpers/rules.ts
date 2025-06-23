import type {
  AccountFollowRuleFragment,
  AccountFollowRules,
  GroupRuleFragment,
  GroupRules
} from "@hey/indexer";
import type { Address } from "viem";
import getAnyKeyValue from "./getAnyKeyValue";

interface AssetDetails {
  assetAddress: Address | null;
  assetSymbol: string | null;
  amount: number | null;
}

const extractPaymentDetails = (
  rules: GroupRuleFragment[] | AccountFollowRuleFragment[]
): AssetDetails => {
  for (const rule of rules) {
    if (rule.type === "SIMPLE_PAYMENT") {
      return {
        amount:
          Number(getAnyKeyValue(rule.config, "amount")?.bigDecimal) || null,
        assetAddress:
          getAnyKeyValue(rule.config, "assetContract")?.address || null,
        assetSymbol: getAnyKeyValue(rule.config, "assetSymbol")?.string || null
      };
    }
  }

  return { amount: null, assetAddress: null, assetSymbol: null };
};

export const getSimplePaymentDetails = (
  rules: GroupRules | AccountFollowRules
): AssetDetails =>
  extractPaymentDetails(rules.required) || extractPaymentDetails(rules.anyOf);
