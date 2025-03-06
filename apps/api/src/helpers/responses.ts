import { Errors } from "@hey/data/errors";
import type { Response } from "express";

/**
 * Sends a 400 Bad Request response with an error message.
 *
 * @param {Response} response - The response object.
 * @returns {Response} The response object with the error message.
 */
export const invalidBody = (response: Response) => {
  return response
    .status(400)
    .json({ error: Errors.InvalidBody, success: false });
};

/**
 * Sends a 400 Bad Request response with an error message.
 *
 * @param {Response} response - The response object.
 * @returns {Response} The response object with the error message.
 */
export const noBody = (response: Response) => {
  return response.status(400).json({ error: Errors.NoBody, success: false });
};

/**
 * Sends a 404 Not Found response with an error message.
 *
 * @param {Response} response - The response object.
 * @returns {Response} The response object with the error message.
 */
export const notFound = (response: Response) => {
  return response.status(404).json({ error: Errors.NotFound, success: false });
};
