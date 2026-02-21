import { Router } from "express";
import { ServicesController } from "../controllers/services.controller";
import Validator from "../middlewares/validator.middleware";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
} from "../validations/services.validator";

const router = Router();

router.get("/", ServicesController.getAll);
router.get("/:id", Validator(serviceIdParamSchema), ServicesController.getById);
router.post("/", Validator(createServiceSchema), ServicesController.create);
router.put("/:id", Validator(updateServiceSchema), ServicesController.update);
router.delete("/:id", Validator(serviceIdParamSchema), ServicesController.remove);

export default router;
