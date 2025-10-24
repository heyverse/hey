import { Hono } from "hono";
import secretMiddleware from "@/middlewares/secretMiddleware";
import syncBetaMembersToGuild from "./guild/syncBetaMembersToGuild";
import syncHeyNamesMembersToGuild from "./guild/syncHeyNamesMembersToGuild";
import syncSubscribersToGuild from "./guild/syncSubscribersToGuild";
import totalSubscribers from "./guild/totalSubscribers";
import removeExpiredSubscribers from "./removeExpiredSubscribers";

const app = new Hono();

app.get("/syncBetaMembersToGuild", secretMiddleware, syncBetaMembersToGuild);
app.get("/syncSubscribersToGuild", secretMiddleware, syncSubscribersToGuild);
app.get(
  "/syncHeyNamesMembersToGuild",
  secretMiddleware,
  syncHeyNamesMembersToGuild
);
app.get("/totalSubscribers", totalSubscribers);
app.get(
  "/removeExpiredSubscribers",
  secretMiddleware,
  removeExpiredSubscribers
);

export default app;
