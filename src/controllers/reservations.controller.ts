import type { Request, Response } from "express";
import { ReservationsService } from "../services/reservations.service";
import { resultCodes } from "../enums";
import { QueryBuilder } from "../utils/QueryBuilder";

export class ReservationsController {
  static async getAll(req: Request, res: Response) {
    const options = new QueryBuilder(req.query as Record<string, unknown>)
      .paginate()
      .sort()
      .filter(["staffId", "status"])
      .search(["customerName", "customerPhone", "notes"])
      .build();

    if (req.query.date) {
      const dayStart = new Date(req.query.date as string);
      const dayEnd = new Date(req.query.date as string);
      dayEnd.setDate(dayEnd.getDate() + 1);
      options.filter = {
        ...options.filter,
        startTime: { gte: dayStart, lt: dayEnd },
      };
    }

    const result = await ReservationsService.findAll(options);
    res.json({ result: resultCodes.SUCCESS, ...result });
  }

  static async getById(req: Request, res: Response) {
    const reservation = await ReservationsService.findById(req.params.id as string);
    res.json({ result: resultCodes.SUCCESS, data: reservation });
  }

  static async create(req: Request, res: Response) {
    const reservation = await ReservationsService.create({
      ...req.body,
      startTime: new Date(req.body.startTime),
    });
    res.status(201).json({ result: resultCodes.SUCCESS, data: reservation });
  }

  static async update(req: Request, res: Response) {
    const data = { ...req.body };
    if (data.startTime) data.startTime = new Date(data.startTime);
    const reservation = await ReservationsService.update(req.params.id as string, data);
    res.json({ result: resultCodes.SUCCESS, data: reservation });
  }

  static async updateStatus(req: Request, res: Response) {
    const reservation = await ReservationsService.updateStatus(
      req.params.id as string,
      req.body.status,
    );
    res.json({ result: resultCodes.SUCCESS, data: reservation });
  }
}
