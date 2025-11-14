import { Hono } from "hono";
import secretMiddleware from "@/middlewares/secretMiddleware";
import removeExpiredSubscribers from "./removeExpiredSubscribers";

const app = new Hono();

app.get(
  "/removeExpiredSubscribers",
  secretMiddleware,
  removeExpiredSubscribers
);

export default app;
