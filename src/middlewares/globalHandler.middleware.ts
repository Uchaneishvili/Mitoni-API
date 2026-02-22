import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { resultCodes } from "../enums";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

interface JoiError extends Error {
  isJoi: boolean;
  details: Array<{ path: (string | number)[]; message: string }>;
}

const isJoiError = (error: unknown): error is JoiError =>
  error instanceof Error && "isJoi" in error && (error as JoiError).isJoi === true;

const isPrismaNotFound = (error: unknown): boolean =>
  error instanceof Error && "code" in error && (error as { code: string }).code === "P2025";

const globalErrorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    return next(error);
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (isJoiError(error)) {
    logger.warn({
      message: "Validation error",
      path: req.path,
      method: req.method,
      details: error.details,
    });

    res.status(400).json({
      result: resultCodes.ERROR,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      },
    });
    return;
  }

  if (isPrismaNotFound(error)) {
    res.status(404).json({
      result: resultCodes.ERROR,
      error: {
        code: "NOT_FOUND",
        message: "Resource not found",
      },
    });
    return;
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";

  logger.error({
    message: error.message,
    code,
    statusCode,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json({
    result: resultCodes.ERROR,
    error: {
      code,
      message: isProduction && statusCode === 500 ? "An unexpected error occurred" : error.message,
      ...(isProduction ? {} : { stack: error.stack }),
    },
  });
};

export default globalErrorHandler;
