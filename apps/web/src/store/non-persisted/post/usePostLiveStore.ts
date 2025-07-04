import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  };
  resetLiveVideoConfig: () => void;
  setLiveVideoConfig: (liveVideoConfig: {
    id: string;
    playbackId: string;
    streamKey: string;
  }) => void;
  setShowLiveVideoEditor: (showLiveVideoEditor: boolean) => void;
  showLiveVideoEditor: boolean;
}

const { useStore: usePostLiveStore } = createTrackedStore<State>((set) => ({
  liveVideoConfig: { id: "", playbackId: "", streamKey: "" },
  resetLiveVideoConfig: () =>
    set(() => ({ liveVideoConfig: { id: "", playbackId: "", streamKey: "" } })),
  setLiveVideoConfig: (liveVideoConfig) => set(() => ({ liveVideoConfig })),
  setShowLiveVideoEditor: (showLiveVideoEditor) =>
    set(() => ({ showLiveVideoEditor })),
  showLiveVideoEditor: false
}));

export { usePostLiveStore };
