import type { Request, Response } from "express";
import { StaffService } from "../services/staff.service";
import { QueryBuilder } from "../utils/QueryBuilder";
import { HttpResponse } from "../utils/HttpResponse";

export class StaffController {
  static async getAll(req: Request, res: Response) {
    const options = new QueryBuilder(req.query as Record<string, unknown>)
      .paginate()
      .sort()
      .filter(["isActive"])
      .search(["firstName", "lastName", "specialization"])
      .build();

    const result = await StaffService.findAll(options);
    HttpResponse.ok(res, result);
  }

  static async getById(req: Request, res: Response) {
    const staff = await StaffService.findById(req.params.id as string);
    HttpResponse.ok(res, staff);
  }

  static async create(req: Request, res: Response) {
    const staff = await StaffService.create(req.body);
    HttpResponse.created(res, staff);
  }

  static async update(req: Request, res: Response) {
    const staff = await StaffService.update(req.params.id as string, req.body);
    HttpResponse.ok(res, staff);
  }

  static async remove(req: Request, res: Response) {
    await StaffService.softDelete(req.params.id as string);
    HttpResponse.ok(res, undefined, "Staff deactivated");
  }

  static async assignServices(req: Request, res: Response) {
    await StaffService.assignServices(req.params.id as string, req.body.serviceIds);
    HttpResponse.ok(res, undefined, "Services assigned");
  }
}
