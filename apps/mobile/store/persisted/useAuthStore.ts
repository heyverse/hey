import { Localstorage } from "@hey/data/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";
import { createPersistedTrackedStore } from "@/store/createTrackedStore";

interface Tokens {
  accessToken: null | string;
  refreshToken: null | string;
}

interface State {
  accessToken: Tokens["accessToken"];
  hydrateAuthTokens: () => Tokens;
  hasHydrated: boolean;
  refreshToken: Tokens["refreshToken"];
  setHasHydrated: (hasHydrated: boolean) => void;
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
}

const { store, useStore: useAuthStore } = createPersistedTrackedStore<State>(
  (set, get) => ({
    accessToken: null,
    hasHydrated: false,
    hydrateAuthTokens: () => {
      const { accessToken, refreshToken } = get();
      return { accessToken, refreshToken };
    },
    refreshToken: null,
    setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    signIn: ({ accessToken, refreshToken }) =>
      set({ accessToken, refreshToken }),
    signOut: async () => {
      set({ accessToken: null, refreshToken: null });
    }
  }),
  {
    name: Localstorage.AuthStore,
    storage: createJSONStorage(() => AsyncStorage)
  }
);

// Mark store as hydrated after persistence rehydrates
// @ts-expect-error - persist extension exists at runtime
store.persist?.onFinishHydration?.(() => {
  store.setState({ hasHydrated: true });
});

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  store.getState().signIn(tokens);
export const signOut = () => store.getState().signOut();
export const hydrateAuthTokens = () => store.getState().hydrateAuthTokens();
export { useAuthStore };
