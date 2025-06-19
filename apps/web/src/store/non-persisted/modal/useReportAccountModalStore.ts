import { createTrackedStore } from "@/store/createTrackedStore";
import type { AccountFragment } from "@hey/indexer";

interface State {
  showReportAccountModal: boolean;
  reportingAccount?: AccountFragment;
  setShowReportAccountModal: (
    showReportAccountModal: boolean,
    reportingAccount?: AccountFragment
  ) => void;
}

const { useStore: useReportAccountModalStore } = createTrackedStore<State>(
  (set) => ({
    showReportAccountModal: false,
    reportingAccount: undefined,
    setShowReportAccountModal: (showReportAccountModal, reportingAccount) =>
      set(() => ({ showReportAccountModal, reportingAccount }))
  })
);

export { useReportAccountModalStore };
