import type { AccountFragment } from "@hey/indexer";
import { zeroAddress } from "viem";

const isAccountDeleted = (account: AccountFragment): boolean =>
  account.owner === zeroAddress;

export default isAccountDeleted;
