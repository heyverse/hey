import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

type Position = `geo:${number},${number}`;

interface State {
  location: string;
  position?: Position;
  setLocation: (location: string) => void;
  setPosition: (position?: Position) => void;
}

const store = create<State>((set) => ({
  location: "",
  position: undefined,
  setLocation: (location) => set(() => ({ location })),
  setPosition: (position) => set(() => ({ position }))
}));

export const usePostCheckinStore = createTrackedSelector(store);
