import type { AmountInput } from "@hey/indexer";

export type StaffPick = {
  accountAddress: string;
};

export type Permission = {
  _count: { profiles: number };
  createdAt: Date;
  id: string;
  key: string;
  type: "COHORT" | "PERMISSION";
};

export type CollectActionType = {
  enabled?: boolean;
  amount?: AmountInput | null;
  recipients?: RecipientDataInput[];
  collectLimit?: null | number;
  followerOnly?: boolean;
  referralShare?: number;
  endsAt?: null | string;
};

export type Preferences = {
  appIcon: number;
  includeLowScore: boolean;
  permissions: string[];
};

export type AccountDetails = {
  isSuspended: boolean;
};
