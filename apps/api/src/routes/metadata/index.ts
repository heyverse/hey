import { Hono } from "hono";
import authMiddleware from "src/middlewares/authMiddleware";
import rateLimiter from "src/middlewares/rateLimiter";
import getSTS from "./getSTS";

const app = new Hono();

app.get("/sts", rateLimiter({ requests: 50 }), authMiddleware, getSTS);

export default app;
