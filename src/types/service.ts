export interface CreateServiceInput {
  name: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateServiceInput {
  name?: string;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
}
