import { Localstorage } from "@hey/data/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
}

interface State {
  credentials?: StsCredentials;
  hydrateSts: () => StsCredentials | undefined;
  setCredentials: (credentials: StsCredentials) => void;
  clearCredentials: () => void;
}

const store = create(
  persist<State>(
    (set, get) => ({
      credentials: undefined,
      hydrateSts: () => get().credentials,
      setCredentials: (credentials) => set(() => ({ credentials })),
      clearCredentials: () => set(() => ({ credentials: undefined }))
    }),
    { name: Localstorage.StsStore }
  )
);

export const hydrateSts = () => store.getState().hydrateSts();
export const setSts = (credentials: StsCredentials) =>
  store.getState().setCredentials(credentials);
export const clearSts = () => store.getState().clearCredentials();
