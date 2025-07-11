import { Localstorage } from "@hey/data/storage";

const reloadAllTabs = (): void => {
  localStorage.setItem(Localstorage.ReloadTabs, Date.now().toString());
  location.reload();
};

export default reloadAllTabs;
