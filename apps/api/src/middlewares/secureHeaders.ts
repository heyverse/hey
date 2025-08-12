import { secureHeaders as secureHeadersMiddleware } from "hono/secure-headers";

const secureHeaders = secureHeadersMiddleware();

export default secureHeaders;
