import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showNewPostModal: boolean;
  setShowNewPostModal: (showNewPostModal: boolean) => void;
}

const { useStore: useNewPostModalStore } = createTrackedStore<State>((set) => ({
  showNewPostModal: false,
  setShowNewPostModal: (showNewPostModal) => set(() => ({ showNewPostModal }))
}));

export { useNewPostModalStore };
