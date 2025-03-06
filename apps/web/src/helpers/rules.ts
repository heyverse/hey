import type {
  AccountFollowRuleFragment,
  AccountFollowRules,
  GroupRuleFragment,
  GroupRules
} from "@hey/indexer";
import getAnyKeyValue from "./getAnyKeyValue";

/**
 * Retrieves whether a group has membership approval.
 *
 * @param {GroupRuleFragment[]} rules - The rules to check.
 * @returns {boolean} - True if the group has membership approval, false otherwise.
 */
const extractMembershipApproval = (rules: GroupRuleFragment[]): boolean => {
  for (const rule of rules) {
    if (rule.type === "MEMBERSHIP_APPROVAL") {
      return true;
    }
  }

  return false;
};

/**
 * Retrieves the membership approval details.
 *
 * @param {GroupRules | AccountFollowRules} rules - The rules to check.
 * @returns {boolean} - True if the group has membership approval, false otherwise.
 */
export const getMembershipApprovalDetails = (rules: GroupRules): boolean =>
  extractMembershipApproval(rules.required) ||
  extractMembershipApproval(rules.anyOf);

interface AssetDetails {
  assetContract: string | null;
  assetSymbol: string | null;
  amount: number | null;
}

/**
 * Retrieves the asset details.
 *
 * @param {GroupRules | AccountFollowRules} rules - The rules to check.
 * @returns {AssetDetails} - The asset details.
 */
const extractPaymentDetails = (
  rules: GroupRuleFragment[] | AccountFollowRuleFragment[]
): AssetDetails => {
  for (const rule of rules) {
    if (rule.type === "SIMPLE_PAYMENT") {
      return {
        assetContract:
          getAnyKeyValue(rule.config, "assetContract")?.address || null,
        assetSymbol: getAnyKeyValue(rule.config, "assetSymbol")?.string || null,
        amount:
          Number(getAnyKeyValue(rule.config, "amount")?.bigDecimal) || null
      };
    }
  }

  return { assetContract: null, assetSymbol: null, amount: null };
};

/**
 * Retrieves the simple payment details.
 *
 * @param {GroupRules | AccountFollowRules} rules - The rules to check.
 * @returns {AssetDetails} - The asset details.
 */
export const getSimplePaymentDetails = (
  rules: GroupRules | AccountFollowRules
): AssetDetails =>
  extractPaymentDetails(rules.required) || extractPaymentDetails(rules.anyOf);
