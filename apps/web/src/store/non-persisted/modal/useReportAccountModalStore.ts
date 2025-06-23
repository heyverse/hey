import type { AccountFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

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
