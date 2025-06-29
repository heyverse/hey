import { createToggleStore } from "@/store/createToggleStore";

const { useStore: useMobileDrawerModalStore } = createToggleStore();

export { useMobileDrawerModalStore };
