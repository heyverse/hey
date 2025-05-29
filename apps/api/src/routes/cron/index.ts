import { Hono } from "hono";
import secretMiddleware from "src/middlewares/secretMiddleware";
import syncFollowersStandingToGuild from "./guild/syncFollowersStandingToGuild";
import syncHQScoreAccountsToGuild from "./guild/syncHQScoreAccountsToGuild";
import syncSubscribersToGuild from "./guild/syncSubscribersToGuild";
import removeExpiredSubscribers from "./removeExpiredSubscribers";

const app = new Hono();

app.get("/syncSubscribersToGuild", secretMiddleware, syncSubscribersToGuild);
app.get(
  "/syncHQScoreAccountsToGuild",
  secretMiddleware,
  syncHQScoreAccountsToGuild
);
app.get(
  "/syncFollowersStandingToGuild",
  secretMiddleware,
  syncFollowersStandingToGuild
);
app.get(
  "/removeExpiredSubscribers",
  secretMiddleware,
  removeExpiredSubscribers
);

export default app;
