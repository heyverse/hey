import { hydrateAccount } from "@/store/persisted/useAccountStore";
import { Access } from "@hey/data/features";
import { getAddress } from "viem";

const isFeatureEnabled = (feature: string): boolean => {
  const address = hydrateAccount()?.address;
  if (!address || !Access[feature]) return false;
  const normalized = getAddress(address);
  return Access[feature].some((acc) => getAddress(acc) === normalized);
};

export default isFeatureEnabled;
