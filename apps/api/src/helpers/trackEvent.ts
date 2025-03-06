import { APP_URL, APP_VERSION } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import axios from "axios";

/**
 * Tracks an event.
 *
 * @param {string} event - The event to track.
 * @param {Record<string, any>} [metadata] - Optional metadata to include with the event.
 * @returns {Promise<null | any>} The response from the event tracker, or null if not found.
 */
const trackEvent = async (event: string, metadata?: Record<string, any>) => {
  try {
    if (!process.env.EVENT_TRACKER_URL) {
      return null;
    }

    const { data } = await axios.post(
      process.env.EVENT_TRACKER_URL,
      {
        type: "event",
        hostname: "hey.xyz",
        ua: `HeyServer/${APP_VERSION} (+${APP_URL})`,
        event,
        metadata
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return data;
  } catch {
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default trackEvent;
