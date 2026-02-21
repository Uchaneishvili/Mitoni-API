import Joi from "joi";
import { Request, Response, NextFunction } from "express";


function isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}


export default function Validator(validator: Joi.ObjectSchema) {
    if (!validator) throw new Error(`validator does not exist`);

    return async function (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { body, query, params } = req;
            const target: { body?: any; query?: any; params?: any } = {};
            if (!isEmpty(body)) target.body = body;
            if (!isEmpty(query)) target.query = query;
            if (!isEmpty(params)) target.params = params;

            const validated = await validator.validateAsync(target, {
                abortEarly: false,
            });

            req.body = validated.body || {};
            req.query = validated.query || {};
            req.params = validated.params || {};
            next();
        } catch (err) {
            return next(err);
        }
    };
}