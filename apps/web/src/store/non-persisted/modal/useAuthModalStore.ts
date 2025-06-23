import { createTrackedStore } from "@/store/createTrackedStore";

type AuthModalType = "login" | "signup";

interface State {
  showAuthModal: boolean;
  authModalType: AuthModalType;
  setShowAuthModal: (
    showAuthModal: boolean,
    authModalType?: AuthModalType
  ) => void;
}

const { useStore: useAuthModalStore } = createTrackedStore<State>((set) => ({
  authModalType: "login",
  setShowAuthModal: (showAuthModal, authModalType) =>
    set(() => ({ authModalType, showAuthModal })),
  showAuthModal: false
}));

export { useAuthModalStore };
