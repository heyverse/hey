import { createTrackedStore } from "@/store/createTrackedStore";

interface EventPost {
  title: string;
  content: string;
  startsAt: string;
  endsAt: string;
  location: string;
  address: {
    country: string;
    locality: string;
    region: string;
  };
}

export const DEFAULT_EVENT_POST: EventPost = {
  address: {
    country: "",
    locality: "",
    region: ""
  },
  content: "",
  endsAt: "",
  location: "",
  startsAt: "",
  title: ""
};

interface State {
  eventPost: EventPost;
  setEventPost: (eventPost: EventPost) => void;
  resetEventPost: () => void;
  setShowEventEditor: (showEventEditor: boolean) => void;
  showEventEditor: boolean;
}

const { useStore: usePostEventStore } = createTrackedStore<State>((set) => ({
  eventPost: DEFAULT_EVENT_POST,
  resetEventPost: () => set(() => ({ eventPost: DEFAULT_EVENT_POST })),
  setEventPost: (eventPost) => set(() => ({ eventPost })),
  setShowEventEditor: (showEventEditor) => set(() => ({ showEventEditor })),
  showEventEditor: false
}));

export { usePostEventStore };
