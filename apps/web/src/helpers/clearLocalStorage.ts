import { Localstorage } from "@hey/data/storage";

const clearLocalStorage = (): void => {
  const storesToClear = Object.values(Localstorage).filter(
    (store) => store !== Localstorage.SearchStore
  );

  for (const store of storesToClear) {
    localStorage.removeItem(store);
  }
};

export default clearLocalStorage;
