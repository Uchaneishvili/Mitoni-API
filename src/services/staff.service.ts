import { db } from "../config/db-setup";
import type { CreateStaffInput, UpdateStaffInput } from "../types/staff";

export class StaffService {
  static async findAll(isActive?: boolean) {
    return db.staff.findMany({
      ...(isActive !== undefined && { where: { isActive } }),
      include: { services: { include: { service: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return db.staff.findUnique({
      where: { id },
      include: { services: { include: { service: true } } },
    });
  }

  static async create(data: CreateStaffInput) {
    return db.staff.create({ data });
  }

  static async update(id: string, data: UpdateStaffInput) {
    return db.staff.update({ where: { id }, data });
  }

  static async softDelete(id: string) {
    return db.staff.update({ where: { id }, data: { isActive: false } });
  }

  static async assignServices(staffId: string, serviceIds: string[]) {
    return db.$transaction(async (tx) => {
      await tx.staffService.deleteMany({ where: { staffId } });

      return tx.staffService.createMany({
        data: serviceIds.map((serviceId) => ({ staffId, serviceId })),
        skipDuplicates: true,
      });
    });
  }
}
