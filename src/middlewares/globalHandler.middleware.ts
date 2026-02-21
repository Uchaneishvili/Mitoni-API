import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { resultCodes } from "../enums";
import logger from "../utils/logger";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

const globalErrorHandler: ErrorRequestHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  logger.error({
    message: error.message,
    code: error.code,
    statusCode,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json({
    result: resultCodes.ERROR,
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: isProduction && statusCode === 500 ? "An unexpected error occurred" : error.message,
      ...(isProduction ? {} : { stack: error.stack }),
    },
  });
};

export default globalErrorHandler;
