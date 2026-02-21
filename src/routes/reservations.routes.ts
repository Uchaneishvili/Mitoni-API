import { Router } from "express";
import { ReservationsController } from "../controllers/reservations.controller";
import Validator from "../middlewares/validator.middleware";
import {
  createReservationSchema,
  updateReservationSchema,
  updateReservationStatusSchema,
  reservationIdParamSchema,
  reservationListQuerySchema,
} from "../validations/reservations.validator";

const router = Router();

router.get("/", Validator(reservationListQuerySchema), ReservationsController.getAll);
router.get("/:id", Validator(reservationIdParamSchema), ReservationsController.getById);
router.post("/", Validator(createReservationSchema), ReservationsController.create);
router.put("/:id", Validator(updateReservationSchema), ReservationsController.update);
router.patch(
  "/:id/status",
  Validator(updateReservationStatusSchema),
  ReservationsController.updateStatus,
);

export default router;
