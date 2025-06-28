import type { PrimitiveAtom } from "jotai";
import { atom, useAtom } from "jotai";

interface AtomStore<State> {
  atom: PrimitiveAtom<State>;
  useStore: () => [State, (value: State) => void];
}

const createAtomStore = <State>(initialState: State): AtomStore<State> => {
  const storeAtom = atom(initialState);
  const useStore = () => useAtom(storeAtom);
  return { atom: storeAtom, useStore };
};

export { createAtomStore };
