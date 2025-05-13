import { Hono } from "hono";
import getProAccounts from "./getProAccounts";
import permissionRouter from "./permission";

const app = new Hono();

app.route("/permission", permissionRouter);
app.get("/pro", getProAccounts);

export default app;
