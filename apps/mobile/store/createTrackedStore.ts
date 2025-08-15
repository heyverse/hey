import { createTrackedSelector } from "react-tracked";
import type { StateCreator, StoreApi } from "zustand";
import { create } from "zustand";
import { type PersistOptions, persist } from "zustand/middleware";

interface TrackedStore<State> {
  store: StoreApi<State>;
  useStore: () => State;
}

export const createTrackedStore = <State>(
  initializer: StateCreator<State>
): TrackedStore<State> => {
  const store = create<State>(initializer);
  const useStore = createTrackedSelector(store);
  return { store, useStore };
};

export const createPersistedTrackedStore = <State>(
  initializer: StateCreator<State>,
  options: PersistOptions<State>
): TrackedStore<State> => {
  const store = create(persist<State>(initializer, options));
  const useStore = createTrackedSelector(store);
  return { store, useStore };
};
