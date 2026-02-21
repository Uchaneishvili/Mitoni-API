import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { resultCodes } from "../enums";
import logger from "../utils/logger";


const globalErrorHandler: ErrorRequestHandler = async (
    error: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (error) {
        const statusCode = error.statusCode || 500;

        logger.error(error);

        res.status(statusCode).json({
            result: resultCodes.ERROR,
            error: {
                name: error.name,
                message: error.message,
            },
        });
    } else {
        next();
    }
};

export default globalErrorHandler;