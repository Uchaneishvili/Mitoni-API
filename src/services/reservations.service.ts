import { db } from "../config/db-setup";
import type { ReservationStatus } from "../generated/prisma/enums";
import type { CreateReservationInput, UpdateReservationInput } from "../types/reservation";

export class ReservationsService {
  static async findAll(filters?: { staffId?: string; date?: string }) {
    const where: Record<string, unknown> = {};

    if (filters?.staffId) {
      where.staffId = filters.staffId;
    }

    if (filters?.date) {
      const dayStart = new Date(filters.date);
      const dayEnd = new Date(filters.date);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where.startTime = { gte: dayStart, lt: dayEnd };
    }

    return db.reservation.findMany({
      ...(Object.keys(where).length > 0 && { where }),
      include: { staff: true, service: true },
      orderBy: { startTime: "asc" },
    });
  }

  static async findById(id: string) {
    return db.reservation.findUnique({
      where: { id },
      include: { staff: true, service: true },
    });
  }

  static async create(data: CreateReservationInput) {
    const service = await db.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error("Service not found");

    const endTime = new Date(data.startTime.getTime() + service.durationMinutes * 60 * 1000);

    const overlap = await db.reservation.findFirst({
      where: {
        staffId: data.staffId,
        status: { notIn: ["CANCELLED"] },
        startTime: { lt: endTime },
        endTime: { gt: data.startTime },
      },
    });

    if (overlap) throw new Error("Time slot conflicts with an existing reservation");

    return db.reservation.create({
      data: { ...data, endTime },
      include: { staff: true, service: true },
    });
  }

  static async update(id: string, data: UpdateReservationInput) {
    let endTime: Date | undefined;

    if (data.startTime || data.serviceId) {
      const existing = await db.reservation.findUnique({ where: { id } });
      if (!existing) throw new Error("Reservation not found");

      const serviceId = data.serviceId || existing.serviceId;
      const startTime = data.startTime || existing.startTime;

      const service = await db.service.findUnique({ where: { id: serviceId } });
      if (!service) throw new Error("Service not found");

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

      if (overlap) throw new Error("Time slot conflicts with an existing reservation");
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
