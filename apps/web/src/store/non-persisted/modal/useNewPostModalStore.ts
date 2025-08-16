import { createToggleStore } from "@/store/createToggleStore";

const { useStore: useNewPostModalStore } = createToggleStore();

export { useNewPostModalStore };
