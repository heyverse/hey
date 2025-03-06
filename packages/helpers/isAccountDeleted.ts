import { NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";

/**
 * Retrieves whether an account is deleted.
 *
 * @param {AccountFragment} account - The account to check.
 * @returns {boolean} A boolean indicating whether the account is deleted.
 */
const isAccountDeleted = (account: AccountFragment): boolean => {
  if (account.owner === NULL_ADDRESS) {
    return true;
  }

  return false;
};

export default isAccountDeleted;
