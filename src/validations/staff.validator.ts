import Joi from "joi";

export const createStaffSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().trim().min(1).max(100).required(),
    lastName: Joi.string().trim().min(1).max(100).required(),
    specialization: Joi.string().trim().min(1).max(200).required(),
  }).required(),
});

export const updateStaffSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    firstName: Joi.string().trim().min(1).max(100),
    lastName: Joi.string().trim().min(1).max(100),
    specialization: Joi.string().trim().min(1).max(200),
    isActive: Joi.boolean(),
  })
    .min(1)
    .required(),
});

export const staffIdParamSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
});

export const assignServicesSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    serviceIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  }).required(),
});
