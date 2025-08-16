import { Localstorage } from "@hey/data/storage";
import { createPersistedTrackedStore } from "@/store/createTrackedStore";

interface State {
  lastSeenNotificationId: string;
  setLastSeenNotificationId: (id: string) => void;
}

const { useStore: useNotificationStore } = createPersistedTrackedStore<State>(
  (set) => ({
    lastSeenNotificationId: "0",
    setLastSeenNotificationId: (id) =>
      set(() => ({ lastSeenNotificationId: id }))
  }),
  { name: Localstorage.NotificationStore }
);

export { useNotificationStore };
