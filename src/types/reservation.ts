export interface CreateReservationInput {
  staffId: string;
  serviceId?: string;
  serviceIds?: string[];
  customerName: string;
  customerPhone?: string;
  startTime: Date;
  notes?: string;
}

export interface UpdateReservationInput {
  staffId?: string;
  serviceId?: string;
  customerName?: string;
  customerPhone?: string;
  startTime?: Date;
  notes?: string;
}
