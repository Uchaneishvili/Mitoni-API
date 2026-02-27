import Joi from "joi";

const RESERVATION_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export const createReservationSchema = Joi.object({
  body: Joi.object({
    staffId: Joi.string().uuid().required(),
    serviceId: Joi.string().uuid(),
    serviceIds: Joi.array().items(Joi.string().uuid()).min(1),
    customerName: Joi.string().trim().min(1).max(200).required(),
    customerPhone: Joi.string().trim().max(50),
    startTime: Joi.date().iso().greater("now").required(),
    notes: Joi.string().trim().max(500),
  }).xor("serviceId", "serviceIds"),
});

export const updateReservationSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    staffId: Joi.string().uuid(),
    serviceId: Joi.string().uuid(),
    customerName: Joi.string().trim().min(1).max(200),
    customerPhone: Joi.string().trim().max(50),
    startTime: Joi.date().iso().greater("now"),
    notes: Joi.string().trim().max(500),
  })
    .min(1)
    .required(),
});

export const updateReservationStatusSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    status: Joi.string()
      .valid(...RESERVATION_STATUSES)
      .required(),
  }).required(),
});

export const reservationIdParamSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }).required(),
});

export const reservationListQuerySchema = Joi.object({
  query: Joi.object({
    staffId: Joi.string().uuid(),
    date: Joi.date().iso(),
  }),
});
