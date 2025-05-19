import { Hono } from "hono";
import secretMiddleware from "src/middlewares/secretMiddleware";
import syncFollowersStanding from "./syncFollowersStanding";
import syncHQScoreAccounts from "./syncHQScoreAccounts";
import syncProAccounts from "./syncProAccounts";

const app = new Hono();

app.get("/syncProAccounts", secretMiddleware, syncProAccounts);
app.get("/syncHQScoreAccounts", secretMiddleware, syncHQScoreAccounts);
app.get("/syncFollowersStanding", secretMiddleware, syncFollowersStanding);

export default app;
