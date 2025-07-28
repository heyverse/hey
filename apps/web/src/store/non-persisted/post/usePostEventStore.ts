import { createTrackedStore } from "@/store/createTrackedStore";

interface EventPost {
  title: string;
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
  endsAt: "",
  location: "",
  startsAt: "",
  title: ""
};

interface State {
  eventPost: EventPost;
  setEventPost: (eventPost: EventPost) => void;
}

const { useStore: usePostEventStore } = createTrackedStore<State>((set) => ({
  eventPost: DEFAULT_EVENT_POST,
  setEventPost: (eventPost) => set(() => ({ eventPost }))
}));

export { usePostEventStore };
