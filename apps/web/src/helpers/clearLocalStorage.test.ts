import { beforeEach, describe, expect, it, vi } from "vitest";
import clearLocalStorage from "./clearLocalStorage";
import { Localstorage } from "@hey/data/storage";

describe("clearLocalStorage", () => {
  beforeEach(() => {
    (global as any).localStorage = {
      removeItem: vi.fn()
    };
  });

  it("removes all keys except search store", () => {
    clearLocalStorage();

    const stores = Object.values(Localstorage).filter(
      (s) => s !== Localstorage.SearchStore
    );

    for (const store of stores) {
      expect((global as any).localStorage.removeItem).toHaveBeenCalledWith(store);
    }

    expect((global as any).localStorage.removeItem).toHaveBeenCalledTimes(
      stores.length
    );
  });
});
