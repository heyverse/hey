import { Hono } from "hono";
import rateLimiter from "src/middlewares/rateLimiter";
import getSTS from "./getSTS";

const app = new Hono();

app.get("/sts", rateLimiter({ requests: 50 }), getSTS);

export default app;
