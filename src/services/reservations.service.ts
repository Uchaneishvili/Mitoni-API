import { db } from "../config/db-setup";
import type { ReservationStatus } from "../generated/prisma/enums";
import type { CreateReservationInput, UpdateReservationInput } from "../types/reservation";
import type { QueryOptions, PaginatedResult } from "../types/common";
import { AppError } from "../utils/AppError";

export class ReservationsService {
  static async findAll(options: QueryOptions = {}): Promise<PaginatedResult<unknown>> {
    const { pagination, sort, filter } = options;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = filter ?? {};

    const [data, total] = await Promise.all([
      db.reservation.findMany({
        where,
        include: { staff: true, service: true },
        orderBy: sort ? { [sort.field]: sort.order } : { startTime: "asc" },
        skip,
        take: limit,
      }),
      db.reservation.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async findById(id: string) {
    const reservation = await db.reservation.findUnique({
      where: { id },
      include: { staff: true, service: true },
    });

    if (!reservation) {
      throw AppError.notFound("Reservation not found");
    }

    return reservation;
  }

  static async create(data: CreateReservationInput) {
    const service = await db.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw AppError.notFound("Service not found");

    const endTime = new Date(data.startTime.getTime() + service.durationMinutes * 60 * 1000);

    const overlap = await db.reservation.findFirst({
      where: {
        staffId: data.staffId,
        status: { notIn: ["CANCELLED"] },
        startTime: { lt: endTime },
        endTime: { gt: data.startTime },
      },
    });

    if (overlap) throw AppError.conflict("Time slot conflicts with an existing reservation");

    return db.reservation.create({
      data: { ...data, endTime },
      include: { staff: true, service: true },
    });
  }

  static async update(id: string, data: UpdateReservationInput) {
    let endTime: Date | undefined;

    if (data.startTime || data.serviceId) {
      const existing = await db.reservation.findUnique({ where: { id } });
      if (!existing) throw AppError.notFound("Reservation not found");

      const serviceId = data.serviceId || existing.serviceId;
      const startTime = data.startTime || existing.startTime;

      const service = await db.service.findUnique({ where: { id: serviceId } });
      if (!service) throw AppError.notFound("Service not found");

      endTime = new Date(startTime.getTime() + service.durationMinutes * 60 * 1000);

      const overlap = await db.reservation.findFirst({
        where: {
          id: { not: id },
          staffId: data.staffId || existing.staffId,
          status: { notIn: ["CANCELLED"] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (overlap) throw AppError.conflict("Time slot conflicts with an existing reservation");
    }

    return db.reservation.update({
      where: { id },
      data: { ...data, ...(endTime && { endTime }) },
      include: { staff: true, service: true },
    });
  }

  static async updateStatus(id: string, status: ReservationStatus) {
    return db.reservation.update({
      where: { id },
      data: { status },
      include: { staff: true, service: true },
    });
  }
}
