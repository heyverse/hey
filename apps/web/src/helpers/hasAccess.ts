import { Access } from "@hey/data/features";
import { getAddress } from "viem";
import getCurrentSession from "./getCurrentSession";

const hasAccess = (feature: string): boolean => {
  const { address } = getCurrentSession();
  const accounts = Access[feature].map((account) => getAddress(account));
  return accounts.includes(getAddress(address));
};

export default hasAccess;
