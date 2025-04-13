import { Hono } from "hono";
import lensAuthorization from "./lensAuthorization";
import lensVerification from "./lensVerification";

const app = new Hono();

app.get("/authorization", lensAuthorization);
app.get("/verification", lensVerification);

export default app;
