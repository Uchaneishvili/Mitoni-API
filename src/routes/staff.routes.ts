import { Router } from "express";
import { StaffController } from "../controllers/staff.controller";
import Validator from "../middlewares/validator.middleware";
import {
  createStaffSchema,
  updateStaffSchema,
  staffIdParamSchema,
  assignServicesSchema,
} from "../validations/staff.validator";

const router = Router();

router.get("/", StaffController.getAll);
router.get("/:id", Validator(staffIdParamSchema), StaffController.getById);
router.post("/", Validator(createStaffSchema), StaffController.create);
router.put("/:id", Validator(updateStaffSchema), StaffController.update);
router.delete("/:id", Validator(staffIdParamSchema), StaffController.remove);
router.post("/:id/services", Validator(assignServicesSchema), StaffController.assignServices);

export default router;
