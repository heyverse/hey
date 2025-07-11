import { Localstorage } from "@hey/data/storage";
import { useEffect } from "react";

const ReloadTabsWatcher = () => {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === Localstorage.ReloadTabs) {
        location.reload();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return null;
};

export default ReloadTabsWatcher;
