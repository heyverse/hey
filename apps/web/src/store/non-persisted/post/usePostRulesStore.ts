import type { FollowersOnlyPostRuleConfig } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  rules?: FollowersOnlyPostRuleConfig;
  setRules: (rules?: FollowersOnlyPostRuleConfig) => void;
}

const store = create<State>((set) => ({
  rules: undefined,
  setRules: (rules) => set(() => ({ rules }))
}));

export const usePostRulesStore = createTrackedSelector(store);
