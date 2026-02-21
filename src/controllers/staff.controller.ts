import type { Request, Response, NextFunction } from "express";
import { StaffService } from "../services/staff.service";
import { resultCodes } from "../enums";

export class StaffController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const staff = await StaffService.findAll(isActive);
      res.json({ result: resultCodes.SUCCESS, data: staff });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = await StaffService.findById(req.params.id as string);
      if (!staff) {
        res.status(404).json({ result: resultCodes.ERROR, message: "Staff not found" });
        return;
      }
      res.json({ result: resultCodes.SUCCESS, data: staff });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = await StaffService.create(req.body);
      res.status(201).json({ result: resultCodes.SUCCESS, data: staff });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = await StaffService.update(req.params.id as string, req.body);
      res.json({ result: resultCodes.SUCCESS, data: staff });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await StaffService.softDelete(req.params.id as string);
      res.json({ result: resultCodes.SUCCESS, message: "Staff deactivated" });
    } catch (error) {
      next(error);
    }
  }

  static async assignServices(req: Request, res: Response, next: NextFunction) {
    try {
      await StaffService.assignServices(req.params.id as string, req.body.serviceIds);
      res.json({ result: resultCodes.SUCCESS, message: "Services assigned" });
    } catch (error) {
      next(error);
    }
  }
}
