import { Router } from "express";
import { ReservationsController } from "../controllers/reservations.controller";
import Validator from "../middlewares/validator.middleware";
import {
  createReservationSchema,
  updateReservationSchema,
  updateReservationStatusSchema,
  reservationIdParamSchema,
} from "../validations/reservations.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(ReservationsController.getAll));
router.get(
  "/:id",
  Validator(reservationIdParamSchema),
  asyncHandler(ReservationsController.getById),
);
router.post("/", Validator(createReservationSchema), asyncHandler(ReservationsController.create));
router.put("/:id", Validator(updateReservationSchema), asyncHandler(ReservationsController.update));
router.patch(
  "/:id/status",
  Validator(updateReservationStatusSchema),
  asyncHandler(ReservationsController.updateStatus),
);

export default router;
