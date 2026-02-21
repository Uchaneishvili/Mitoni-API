import type { Request, Response, NextFunction } from "express";
import { ServicesService } from "../services/services.service";
import { resultCodes } from "../enums";

export class ServicesController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const services = await ServicesService.findAll(isActive);
      res.json({ result: resultCodes.SUCCESS, data: services });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServicesService.findById(req.params.id as string);
      if (!service) {
        res.status(404).json({ result: resultCodes.ERROR, message: "Service not found" });
        return;
      }
      res.json({ result: resultCodes.SUCCESS, data: service });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServicesService.create(req.body);
      res.status(201).json({ result: resultCodes.SUCCESS, data: service });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServicesService.update(req.params.id as string, req.body);
      res.json({ result: resultCodes.SUCCESS, data: service });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await ServicesService.softDelete(req.params.id as string);
      res.json({ result: resultCodes.SUCCESS, message: "Service deactivated" });
    } catch (error) {
      next(error);
    }
  }
}
