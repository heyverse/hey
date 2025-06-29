import { createToggleStore } from "@/store/createToggleStore";

const { useStore: useShortcutsModalStore } = createToggleStore();

export { useShortcutsModalStore };
