import { Hono } from "hono";
import authMiddleware from "@/middlewares/authMiddleware";
import rateLimiter from "@/middlewares/rateLimiter";
import getSTS from "./getSTS";

const app = new Hono();

app.get("/sts", rateLimiter({ requests: 50 }), authMiddleware, getSTS);

export default app;
