import { db } from "../config/db-setup";
import type { CreateServiceInput, UpdateServiceInput } from "../types/service";
import type { QueryOptions, PaginatedResult } from "../types/common";
import { AppError } from "../utils/AppError";

const extractCustomFields = (data: Record<string, any>) => {
  const customFields: Record<string, any> = {};
  const staticKeys = ["name", "durationMinutes", "price", "isActive", "color"];

  for (const key in data) {
    if (!staticKeys.includes(key)) {
      customFields[key] = data[key];
    }
  }

  return customFields;
};

const flattenService = (service: any) => {
  if (!service) return service;

  const { customFields, ...rest } = service;

  // Spread custom fields into the root, overwriting anything if there's an impossible collision,
  // but static fields should generally remain safe due to extracted logic.
  let parsedCustomFields = {};
  if (customFields) {
    try {
      // Prisma returns Json fields as typed objects, but just in case it's a string from DB:
      parsedCustomFields =
        typeof customFields === "string" ? JSON.parse(customFields) : customFields;
    } catch (e) {
      console.error("Failed to parse customFields", e);
    }
  }

  return { ...rest, ...parsedCustomFields };
};

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

    const flattenedData = data.map(flattenService);

    return {
      data: flattenedData,
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

    return flattenService(service);
  }

  static async create(data: CreateServiceInput) {
    const customFields = extractCustomFields(data);
    const { name, durationMinutes, price, color } = data;

    const service = await db.service.create({
      data: {
        name,
        durationMinutes,
        price,
        color: color ?? null,
        customFields,
      },
    });

    return flattenService(service);
  }

  static async update(id: string, data: UpdateServiceInput) {
    const customFields = extractCustomFields(data);
    const { name, durationMinutes, price, isActive, color } = data;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (durationMinutes !== undefined) updateData.durationMinutes = durationMinutes;
    if (price !== undefined) updateData.price = price;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (color !== undefined) updateData.color = color;

    // Only update customFields if there are dynamic keys passed, otherwise leave them alone.
    // If you want to wipe it completely when no keys are passed, this logic will need tweaking.
    // Usually for PUT/PATCH, we only update what's given. But standard REST PUT replaces the whole object.
    // To allow removing keys, the frontend usually sends them as null or empty.
    if (Object.keys(customFields).length > 0) {
      updateData.customFields = customFields;
    }

    const service = await db.service.update({
      where: { id },
      data: updateData,
    });

    return flattenService(service);
  }

  static async softDelete(id: string) {
    const service = await db.service.update({ where: { id }, data: { isActive: false } });
    return flattenService(service);
  }
}
