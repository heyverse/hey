import { Errors } from "@hey/data/errors";
import type { Response } from "express";

const sendErrorResponse = (
  response: Response,
  status: number,
  error: string
) => {
  return response.status(status).json({ error, success: false });
};

export const invalidBody = (response: Response) => {
  return sendErrorResponse(response, 400, Errors.InvalidBody);
};

export const noBody = (response: Response) => {
  return sendErrorResponse(response, 400, Errors.NoBody);
};

export const notFound = (response: Response) => {
  return sendErrorResponse(response, 404, Errors.NotFound);
};
