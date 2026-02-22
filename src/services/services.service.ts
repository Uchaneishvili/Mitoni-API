import { db } from "../config/db-setup";
import type { CreateServiceInput, UpdateServiceInput } from "../types/service";
import type { QueryOptions, PaginatedResult } from "../types/common";
import { AppError } from "../utils/AppError";

export class ServicesService {
  static async findAll(options: QueryOptions = {}): Promise<PaginatedResult<unknown>> {
    const { pagination, sort, filter } = options;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = { isActive: true, ...filter };

    const [data, total] = await Promise.all([
      db.service.findMany({
        where,
        orderBy: sort ? { [sort.field]: sort.order } : { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.service.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async findById(id: string) {
    const service = await db.service.findUnique({
      where: { id },
      include: { staff: { include: { staff: true } } },
    });

    if (!service) {
      throw AppError.notFound("Service not found");
    }

    return service;
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
