import type { Request, Response } from "express";
import { StaffService } from "../services/staff.service";
import { resultCodes } from "../enums";
import { QueryBuilder } from "../utils/QueryBuilder";

export class StaffController {
  static async getAll(req: Request, res: Response) {
    const options = new QueryBuilder(req.query as Record<string, unknown>)
      .paginate()
      .sort()
      .filter(["isActive"])
      .search(["firstName", "lastName", "specialization"])
      .build();

    const result = await StaffService.findAll(options);
    res.json({ result: resultCodes.SUCCESS, ...result });
  }

  static async getById(req: Request, res: Response) {
    const staff = await StaffService.findById(req.params.id as string);
    res.json({ result: resultCodes.SUCCESS, data: staff });
  }

  static async create(req: Request, res: Response) {
    const staff = await StaffService.create(req.body);
    res.status(201).json({ result: resultCodes.SUCCESS, data: staff });
  }

  static async update(req: Request, res: Response) {
    const staff = await StaffService.update(req.params.id as string, req.body);
    res.json({ result: resultCodes.SUCCESS, data: staff });
  }

  static async remove(req: Request, res: Response) {
    await StaffService.softDelete(req.params.id as string);
    res.json({ result: resultCodes.SUCCESS, message: "Staff deactivated" });
  }

  static async assignServices(req: Request, res: Response) {
    await StaffService.assignServices(req.params.id as string, req.body.serviceIds);
    res.json({ result: resultCodes.SUCCESS, message: "Services assigned" });
  }
}
