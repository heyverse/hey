import logger from "@hey/helpers/logger";
import type { Response } from "express";

const catchedError = (
  res: Response,
  { message, ...rest }: any,
  status = 500
) => {
  logger.error(rest);

  return res.status(status).json({
    error: status < 500 ? "client_error" : "server_error",
    message,
    success: false
  });
};

export default catchedError;
