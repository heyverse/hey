import { createPersistedTrackedStore } from "@/store/createTrackedStore";
import { HomeFeedType } from "@hey/data/enums";
import { Localstorage } from "@hey/data/storage";

interface State {
  feedType: HomeFeedType;
  setFeedType: (feedType: HomeFeedType) => void;
}

const { useStore: useHomeTabStore } = createPersistedTrackedStore<State>(
  (set) => ({
    feedType: HomeFeedType.FOLLOWING,
    setFeedType: (feedType) => set(() => ({ feedType }))
  }),
  { name: Localstorage.HomeTabStore }
);

export { useHomeTabStore };
