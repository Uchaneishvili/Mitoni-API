import { Router } from "express";
import { ServicesController } from "../controllers/services.controller";
import Validator from "../middlewares/validator.middleware";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
} from "../validations/services.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(ServicesController.getAll));
router.get("/:id", Validator(serviceIdParamSchema), asyncHandler(ServicesController.getById));
router.post("/", Validator(createServiceSchema), asyncHandler(ServicesController.create));
router.put("/:id", Validator(updateServiceSchema), asyncHandler(ServicesController.update));
router.delete("/:id", Validator(serviceIdParamSchema), asyncHandler(ServicesController.remove));

export default router;
