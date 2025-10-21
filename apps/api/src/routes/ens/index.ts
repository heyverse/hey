import { Hono } from "hono";
import ccip from "./resolver/ccip";
import getAddr from "./resolver/getAddr";

const app = new Hono();

app.get("/ccip/:sender/:data", ccip);
app.get("/addr", getAddr);

export default app;
