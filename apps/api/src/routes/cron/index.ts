import { Hono } from "hono";
import secretMiddleware from "@/middlewares/secretMiddleware";
import syncSubscribersToGuild from "./guild/syncSubscribersToGuild";
import totalSubscribers from "./guild/totalSubscribers";
import removeExpiredSubscribers from "./removeExpiredSubscribers";

const app = new Hono();

app.get("/syncSubscribersToGuild", secretMiddleware, syncSubscribersToGuild);
app.get("/totalSubscribers", secretMiddleware, totalSubscribers);
app.get(
  "/removeExpiredSubscribers",
  secretMiddleware,
  removeExpiredSubscribers
);

export default app;
