import { APP_URL, APP_VERSION } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import axios from "axios";

const createEventPayload = (event: string, metadata?: Record<string, any>) => ({
  type: "event",
  hostname: "hey.xyz",
  ua: `HeyServer/${APP_VERSION} (+${APP_URL})`,
  event,
  metadata
});

const trackEvent = async (event: string, metadata?: Record<string, any>) => {
  try {
    if (!process.env.EVENT_TRACKER_URL) {
      return null;
    }

    const { data } = await axios.post(
      process.env.EVENT_TRACKER_URL,
      createEventPayload(event, metadata),
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  } catch {
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default trackEvent;
