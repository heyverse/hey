import { Hono } from "hono";
import conversationsRouter from "./conversations";

const app = new Hono();

app.route("/conversations", conversationsRouter);

export default app;
