import { Hono } from "hono";
import secretMiddleware from "@/middlewares/secretMiddleware";
import syncSubscribersToGuild from "./guild/syncSubscribersToGuild";
import removeExpiredSubscribers from "./removeExpiredSubscribers";

const app = new Hono();

app.get("/syncSubscribersToGuild", secretMiddleware, syncSubscribersToGuild);
app.get(
  "/removeExpiredSubscribers",
  secretMiddleware,
  removeExpiredSubscribers
);

export default app;
