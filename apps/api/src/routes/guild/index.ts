import { Hono } from "hono";
import secretMiddleware from "src/middlewares/secretMiddleware";
import syncFollowersStanding from "./syncFollowersStanding";
import syncHQScoreAccounts from "./syncHQScoreAccounts";
import syncSubscribers from "./syncSubscribers";

const app = new Hono();

app.get("/syncSubscribers", secretMiddleware, syncSubscribers);
app.get("/syncHQScoreAccounts", secretMiddleware, syncHQScoreAccounts);
app.get("/syncFollowersStanding", secretMiddleware, syncFollowersStanding);

export default app;
