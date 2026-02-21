import { db } from "../config/db-setup";
import type { CreateServiceInput, UpdateServiceInput } from "../types/service";

export class ServicesService {
  static async findAll(isActive?: boolean) {
    return db.service.findMany({
      ...(isActive !== undefined && { where: { isActive } }),
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return db.service.findUnique({
      where: { id },
      include: { staff: { include: { staff: true } } },
    });
  }

  static async create(data: CreateServiceInput) {
    return db.service.create({ data });
  }

  static async update(id: string, data: UpdateServiceInput) {
    return db.service.update({ where: { id }, data });
  }

  static async softDelete(id: string) {
    return db.service.update({ where: { id }, data: { isActive: false } });
  }
}
