import { createPersistedTrackedStore } from "@/store/createTrackedStore";
import { Localstorage } from "@hey/data/storage";

interface Tokens {
  accessToken: null | string;
  refreshToken: null | string;
}

interface State {
  accessToken: Tokens["accessToken"];
  hydrateAuthTokens: () => Tokens;
  refreshToken: Tokens["refreshToken"];
  signIn: (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  signOut: () => void;
}

const { store } = createPersistedTrackedStore<State>(
  (set, get) => ({
    accessToken: null,
    hydrateAuthTokens: () => {
      const { accessToken, refreshToken } = get();
      return { accessToken, refreshToken };
    },
    refreshToken: null,
    signIn: ({ accessToken, refreshToken }) =>
      set({ accessToken, refreshToken }),
    signOut: async () => {
      // Clear Localstorage
      const allLocalstorageStores = Object.values(Localstorage).filter(
        (value) => value !== Localstorage.SearchStore
      );
      for (const store of allLocalstorageStores) {
        localStorage.removeItem(store);
      }
    }
  }),
  { name: Localstorage.AuthStore }
);

export const signIn = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => store.getState().signIn(tokens);
export const signOut = () => store.getState().signOut();
export const hydrateAuthTokens = () => store.getState().hydrateAuthTokens();
