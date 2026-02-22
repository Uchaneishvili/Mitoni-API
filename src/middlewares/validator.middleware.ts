import type Joi from "joi";
import type { Request, Response, NextFunction, RequestHandler } from "express";

type ValidatableFields = "body" | "query" | "params";
type ValidatableRequest = Pick<Request, ValidatableFields>;

const hasKeys = (obj: Record<string, unknown> | undefined | null): boolean =>
  obj != null && Object.keys(obj).length > 0;

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

      const vQuery = validated.query ?? {};
      Object.keys(req.query as Record<string, unknown>).forEach(
        (k) => delete (req.query as Record<string, unknown>)[k],
      );
      Object.assign(req.query, vQuery);

      const vParams = validated.params ?? {};
      Object.keys(req.params).forEach((k) => delete req.params[k]);
      Object.assign(req.params, vParams);

      next();
    } catch (err) {
      next(err);
    }
  };
}
