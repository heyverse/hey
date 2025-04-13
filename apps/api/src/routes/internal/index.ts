import { Hono } from "hono";
import accountRouter from "./account";

const app = new Hono();

app.route("/account", accountRouter);

export default app;
