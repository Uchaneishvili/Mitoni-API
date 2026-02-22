import { createLogger, format, transports } from "winston";
import path from "path";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: "mitoni-api" },
  transports: [
    new transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? format.combine(format.timestamp(), format.json())
          : format.combine(format.colorize(), format.simple()),
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
  );
  logger.add(
    new transports.File({
      filename: path.join("logs", "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  );
}

export default logger;
