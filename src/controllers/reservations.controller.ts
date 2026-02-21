import type { Request, Response, NextFunction } from "express";
import { ReservationsService } from "../services/reservations.service";
import { resultCodes } from "../enums";

export class ReservationsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: { staffId?: string; date?: string } = {};
      if (req.query.staffId) filters.staffId = req.query.staffId as string;
      if (req.query.date) filters.date = req.query.date as string;
      const reservations = await ReservationsService.findAll(filters);
      res.json({ result: resultCodes.SUCCESS, data: reservations });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationsService.findById(req.params.id as string);
      if (!reservation) {
        res.status(404).json({ result: resultCodes.ERROR, message: "Reservation not found" });
        return;
      }
      res.json({ result: resultCodes.SUCCESS, data: reservation });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationsService.create({
        ...req.body,
        startTime: new Date(req.body.startTime),
      });
      res.status(201).json({ result: resultCodes.SUCCESS, data: reservation });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      if (data.startTime) data.startTime = new Date(data.startTime);
      const reservation = await ReservationsService.update(req.params.id as string, data);
      res.json({ result: resultCodes.SUCCESS, data: reservation });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationsService.updateStatus(
        req.params.id as string,
        req.body.status,
      );
      res.json({ result: resultCodes.SUCCESS, data: reservation });
    } catch (error) {
      next(error);
    }
  }
}
