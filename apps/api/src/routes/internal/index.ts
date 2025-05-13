import { Hono } from "hono";
import getProAccounts from "./getProAccounts";

const app = new Hono();

app.get("/pro", getProAccounts);

export default app;
