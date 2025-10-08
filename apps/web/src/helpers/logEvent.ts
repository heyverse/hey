import { hono } from "@/helpers/fetcher";

const logEvent = async (eventName: string) => {
  try {
    await hono.events.create({ event: eventName });
  } catch {}
};

export default logEvent;
