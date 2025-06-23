import type { FollowersOnlyPostRuleConfig } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  rules?: FollowersOnlyPostRuleConfig;
  setRules: (rules?: FollowersOnlyPostRuleConfig) => void;
}

const { useStore: usePostRulesStore } = createTrackedStore<State>((set) => ({
  rules: undefined,
  setRules: (rules) => set(() => ({ rules }))
}));

export { usePostRulesStore };
