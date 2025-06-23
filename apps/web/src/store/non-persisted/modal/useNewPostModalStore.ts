import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showNewPostModal: boolean;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
}

const { useStore: useNewPostModalStore } = createTrackedStore<State>((set) => ({
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal })),
  showNewPostModal: false
}));

export { useNewPostModalStore };
