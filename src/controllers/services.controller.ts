import type { Request, Response } from "express";
import { ServicesService } from "../services/services.service";
import { QueryBuilder } from "../utils/QueryBuilder";
import { HttpResponse } from "../utils/HttpResponse";

export class ServicesController {
  static async getAll(req: Request, res: Response) {
    const options = new QueryBuilder(req.query as Record<string, unknown>)
      .paginate()
      .sort()
      .filter(["isActive"])
      .search(["name"])
      .build();

    const result = await ServicesService.findAll(options);
    HttpResponse.ok(res, result);
  }

  static async getById(req: Request, res: Response) {
    const service = await ServicesService.findById(req.params.id as string);
    HttpResponse.ok(res, service);
  }

  static async create(req: Request, res: Response) {
    const service = await ServicesService.create(req.body);
    HttpResponse.created(res, service);
  }

  static async update(req: Request, res: Response) {
    const service = await ServicesService.update(req.params.id as string, req.body);
    HttpResponse.ok(res, service);
  }

  static async remove(req: Request, res: Response) {
    await ServicesService.softDelete(req.params.id as string);
    HttpResponse.ok(res, undefined, "Service deactivated");
  }
}
