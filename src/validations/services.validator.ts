import Joi from "joi";

export const createServiceSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    durationMinutes: Joi.number().integer().min(5).max(480).required(),
    price: Joi.number().positive().precision(2).required(),
    color: Joi.string()
      .trim()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .optional(),
  })
    .unknown(true)
    .required(),
});

export const updateServiceSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200),
    durationMinutes: Joi.number().integer().min(5).max(480),
    price: Joi.number().positive().precision(2),
    isActive: Joi.boolean(),
    color: Joi.string()
      .trim()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .optional(),
  })
    .unknown(true)
    .min(1)
    .required(),
});

export const serviceIdParamSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
});
