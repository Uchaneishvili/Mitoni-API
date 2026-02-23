import { db } from "../config/db-setup";
import type { CreateStaffInput, UpdateStaffInput } from "../types/staff";
import type { QueryOptions, PaginatedResult } from "../types/common";
import { AppError } from "../utils/AppError";

export class StaffService {
  static async findAll(options: QueryOptions = {}): Promise<PaginatedResult<unknown>> {
    const { pagination, sort, filter } = options;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { isActive: true, ...filter };

    const [data, total] = await Promise.all([
      db.staff.findMany({
        where,
        include: { services: { include: { service: true } } },
        orderBy: sort ? { [sort.field]: sort.order } : { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.staff.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async findById(id: string) {
    const staff = await db.staff.findUnique({
      where: { id },
      include: { services: { include: { service: true } } },
    });

    if (!staff) {
      throw AppError.notFound("Staff member not found");
    }

    return staff;
  }

  static async create(data: CreateStaffInput) {
    const { services, ...staffData } = data;

    if (services && services.length > 0) {
      const existingServicesCount = await db.service.count({
        where: { id: { in: services } },
      });

      if (existingServicesCount !== services.length) {
        throw AppError.badRequest("One or more assigned services do not exist");
      }
    }

    return db.staff.create({
      data: {
        ...staffData,
        ...(services?.length
          ? {
              services: {
                create: services.map((serviceId) => ({ serviceId })),
              },
            }
          : {}),
      },
      include: { services: { include: { service: true } } },
    });
  }

  static async update(id: string, data: UpdateStaffInput) {
    const { services, ...staffData } = data;

    if (services?.length) {
      const existingServicesCount = await db.service.count({
        where: { id: { in: services } },
      });

      if (existingServicesCount !== services.length) {
        throw AppError.badRequest("One or more assigned services do not exist");
      }
    }

    return db.staff.update({
      where: { id },
      data: {
        ...staffData,
        ...(services
          ? {
              services: {
                deleteMany: {},
                create: services.map((serviceId) => ({ serviceId })),
              },
            }
          : {}),
      },
      include: { services: { include: { service: true } } },
    });
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
