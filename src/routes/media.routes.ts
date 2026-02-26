import { Router } from "express";
import { MediaController } from "../controllers/media.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/upload", uploadMiddleware.single("file"), asyncHandler(MediaController.upload));

export default router;
