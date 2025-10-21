import { cors as corsMiddleware } from "hono/cors";

const cors = corsMiddleware({
  allowHeaders: ["Content-Type", "X-Access-Token"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  origin: "*"
});

export default cors;
