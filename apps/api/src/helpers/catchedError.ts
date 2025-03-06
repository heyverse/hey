import logger from "@hey/helpers/logger";
import type { Response } from "express";

/**
 * Catches an error and sends a JSON response with the error details.
 *
 * @param {Response} res - The response object.
 * @param {any} error - The error object.
 * @param {number} [status=500] - The HTTP status code.
 * @returns {void} Sends a JSON response with the error details.
 */
const catchedError = (res: Response, error: any, status?: number) => {
  const statusCode = status || 500;
  logger.error(error);

  return res.status(statusCode).json({
    error: statusCode < 500 ? "client_error" : "server_error",
    message: error.message,
    success: false
  });
};

export default catchedError;
