import type Joi from "joi";
import type { Request, Response, NextFunction, RequestHandler } from "express";

type ValidatableFields = "body" | "query" | "params";
type ValidatableRequest = Pick<Request, ValidatableFields>;

const hasKeys = (obj: Record<string, unknown>): boolean => Object.keys(obj).length > 0;

export default function Validator(schema: Joi.ObjectSchema): RequestHandler {
  if (!schema) {
    throw new Error("Validation schema is required");
  }
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const toValidate: Partial<ValidatableRequest> = {};

      if (hasKeys(req.body)) toValidate.body = req.body;
      if (hasKeys(req.query as Record<string, unknown>)) toValidate.query = req.query;
      if (hasKeys(req.params)) toValidate.params = req.params;

      const validated = await schema.validateAsync(toValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = validated.body ?? {};
      req.query = validated.query ?? {};
      req.params = validated.params ?? {};

      next();
    } catch (err) {
      next(err);
    }
  };
}
