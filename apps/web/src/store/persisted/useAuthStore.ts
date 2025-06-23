import { Localstorage } from "@hey/data/storage";
import clearLocalStorage from "@/helpers/clearLocalStorage";
import { createPersistedTrackedStore } from "@/store/createTrackedStore";

interface Tokens {
  accessToken: null | string;
  refreshToken: null | string;
}

interface State {
  accessToken: Tokens["accessToken"];
  hydrateAuthTokens: () => Tokens;
  refreshToken: Tokens["refreshToken"];
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
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
      clearLocalStorage();
    }
  }),
  { name: Localstorage.AuthStore }
);

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  store.getState().signIn(tokens);
export const signOut = () => store.getState().signOut();
export const hydrateAuthTokens = () => store.getState().hydrateAuthTokens();
