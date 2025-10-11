import { hono } from "@/helpers/fetcher";

const logEvent = async (event: string) => {
  try {
    await hono.events.create({ event });
  } catch {}
};

export default logEvent;
