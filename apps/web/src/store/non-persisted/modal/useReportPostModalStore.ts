import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showReportPostModal: boolean;
  reportingPostId?: string;
  setShowReportPostModal: (
    showReportPostModal: boolean,
    reportingPostId?: string
  ) => void;
}

const { useStore: useReportPostModalStore } = createTrackedStore<State>(
  (set) => ({
    reportingPostId: undefined,
    setShowReportPostModal: (showReportPostModal, reportingPostId) =>
      set(() => ({ reportingPostId, showReportPostModal })),
    showReportPostModal: false
  })
);

export { useReportPostModalStore };
