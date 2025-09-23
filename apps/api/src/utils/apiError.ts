import type { StatusCode } from "hono/utils/http-status";

export default class ApiError extends Error {
  public statusCode: StatusCode;

  constructor(statusCode: StatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
