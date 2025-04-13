import { Hono } from "hono";
import permissionRouter from "./permission";

const app = new Hono();

app.route("/permission", permissionRouter);

export default app;
