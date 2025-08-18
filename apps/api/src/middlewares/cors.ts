import { cors as corsMiddleware } from "hono/cors";

const allowedOrigins = [
  "https://hey.xyz",
  "https://testnet.hey.xyz",
  "https://staging.hey.xyz",
  "http://localhost:4783",
  "https://developer.lens.xyz",
  "https://yoginth.com",
  "http://localhost:3000",
  "http://localhost:4783"
];

const cors = corsMiddleware({
  allowHeaders: ["Content-Type", "X-Access-Token"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  origin: allowedOrigins
});

export default cors;
