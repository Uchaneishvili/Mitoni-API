import { db } from "../config/db-setup";
import type { ReservationStatus } from "../generated/prisma/enums";
import type { Prisma } from "../generated/prisma/client";
import type { CreateReservationInput, UpdateReservationInput } from "../types/reservation";
import type { QueryOptions, PaginatedResult } from "../types/common";
import { AppError } from "../utils/AppError";

export class ReservationsService {
  static async findAll(options: QueryOptions = {}): Promise<PaginatedResult<unknown>> {
    const { pagination, sort, filter } = options;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const baseFilter = (filter as Prisma.ReservationWhereInput) || {};

    const where: Prisma.ReservationWhereInput = {
      status: { not: "CANCELLED" },
      ...baseFilter,
    };

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
    const serviceIds = data.serviceIds || (data.serviceId ? [data.serviceId] : []);

    if (serviceIds.length === 0) {
      throw AppError.badRequest("At least one service is required");
    }

    const services = await db.service.findMany({
      where: {
        id: { in: serviceIds },
        isActive: true,
      },
    });

    if (services.length !== new Set(serviceIds).size) {
      throw AppError.notFound("One or more active services not found");
    }

    const orderedServices = serviceIds.map((id) => services.find((s) => s.id === id)!);

    const staffServices = await db.staffService.findMany({
      where: {
        staffId: data.staffId,
        serviceId: { in: serviceIds },
      },
      include: { staff: true },
    });

    if (staffServices.length !== new Set(serviceIds).size) {
      throw AppError.badRequest("Selected staff member does not provide all requested services");
    }

    const staff = staffServices[0]?.staff;
    if (!staff || !staff.isActive) {
      throw AppError.badRequest("Selected staff member is inactive");
    }

    let currentStartTime = data.startTime;
    const reservationsToCreate = [];

    for (const service of orderedServices) {
      const endTime = new Date(currentStartTime.getTime() + service.durationMinutes * 60 * 1000);
      reservationsToCreate.push({
        staffId: data.staffId,
        serviceId: service.id,
        customerName: data.customerName,
        customerPhone: data.customerPhone ?? null,
        notes: data.notes ?? null,
        startTime: currentStartTime,
        endTime,
      });
      currentStartTime = endTime;
    }

    const finalEndTime = currentStartTime;

    const overlap = await db.reservation.findFirst({
      where: {
        staffId: data.staffId,
        status: { notIn: ["CANCELLED"] },
        startTime: { lt: finalEndTime },
        endTime: { gt: data.startTime },
      },
    });

    if (overlap) throw AppError.conflict("Time slot conflicts with an existing reservation");

    const createdReservations = await db.$transaction(
      reservationsToCreate.map((reservation) =>
        db.reservation.create({
          data: reservation,
          include: { staff: true, service: true },
        }),
      ),
    );

    return createdReservations;
  }

  static async update(id: string, data: UpdateReservationInput) {
    let endTime: Date | undefined;

    if (data.startTime || data.serviceId || data.staffId) {
      const existing = await db.reservation.findUnique({ where: { id } });
      if (!existing) throw AppError.notFound("Reservation not found");

      const serviceId = data.serviceId || existing.serviceId;
      const staffId = data.staffId || existing.staffId;
      const startTime = data.startTime || existing.startTime;

      const service = await db.service.findFirst({ where: { id: serviceId, isActive: true } });
      if (!service) throw AppError.notFound("Active service not found");

      const staffService = await db.staffService.findFirst({
        where: { staffId, serviceId },
        include: { staff: true },
      });
      if (!staffService || !staffService.staff.isActive) {
        throw AppError.badRequest(
          "Selected staff member does not provide this service or is inactive",
        );
      }

      endTime = new Date(startTime.getTime() + service.durationMinutes * 60 * 1000);

      const overlap = await db.reservation.findFirst({
        where: {
          id: { not: id },
          staffId,
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
