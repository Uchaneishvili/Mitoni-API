import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import Validator from "../middlewares/validator.middleware";
import {
  createStaffSchema,
  updateStaffSchema,
  staffIdParamSchema,
  assignServicesSchema,
} from "../validations/staff.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(StaffController.getAll));
router.get("/:id", Validator(staffIdParamSchema), asyncHandler(StaffController.getById));
router.post("/", Validator(createStaffSchema), asyncHandler(StaffController.create));
router.put("/:id", Validator(updateStaffSchema), asyncHandler(StaffController.update));
router.delete("/:id", Validator(staffIdParamSchema), asyncHandler(StaffController.remove));
router.post(
  "/:id/services",
  Validator(assignServicesSchema),
  asyncHandler(StaffController.assignServices),
);

export default router;
