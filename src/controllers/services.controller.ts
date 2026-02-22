import type { Request, Response } from "express";
import { ServicesService } from "../services/services.service";
import { resultCodes } from "../enums";
import { QueryBuilder } from "../utils/QueryBuilder";

export class ServicesController {
  static async getAll(req: Request, res: Response) {
    const options = new QueryBuilder(req.query as Record<string, unknown>)
      .paginate()
      .sort()
      .filter(["isActive"])
      .search(["name"])
      .build();

    const result = await ServicesService.findAll(options);
    res.json({ result: resultCodes.SUCCESS, ...result });
  }

  static async getById(req: Request, res: Response) {
    const service = await ServicesService.findById(req.params.id as string);
    res.json({ result: resultCodes.SUCCESS, data: service });
  }

  static async create(req: Request, res: Response) {
    const service = await ServicesService.create(req.body);
    res.status(201).json({ result: resultCodes.SUCCESS, data: service });
  }

  static async update(req: Request, res: Response) {
    const service = await ServicesService.update(req.params.id as string, req.body);
    res.json({ result: resultCodes.SUCCESS, data: service });
  }

  static async remove(req: Request, res: Response) {
    await ServicesService.softDelete(req.params.id as string);
    res.json({ result: resultCodes.SUCCESS, message: "Service deactivated" });
  }
}
