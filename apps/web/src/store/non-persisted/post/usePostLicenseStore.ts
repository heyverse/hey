import { createTrackedStore } from "@/store/createTrackedStore";
import type { MetadataLicenseType } from "@hey/indexer";

interface State {
  license: MetadataLicenseType | null;
  setLicense: (license: MetadataLicenseType | null) => void;
}

const { useStore: usePostLicenseStore } = createTrackedStore<State>((set) => ({
  license: null,
  setLicense: (license) => set(() => ({ license }))
}));

export { usePostLicenseStore };
