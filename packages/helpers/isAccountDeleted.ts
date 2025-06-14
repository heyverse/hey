import { NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";

const isAccountDeleted = (account: AccountFragment): boolean =>
  account.owner === NULL_ADDRESS;

export default isAccountDeleted;
