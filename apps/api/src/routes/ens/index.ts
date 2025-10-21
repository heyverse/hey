import { Hono } from "hono";
import ccip from "./resolver/ccip";
import getAccount from "./resolver/getAccount";

const app = new Hono();

app.get("/ccip/:sender/:data", ccip);
app.get("/account", getAccount);

export default app;
