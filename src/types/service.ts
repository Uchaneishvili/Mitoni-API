export interface CreateServiceInput {
  name: string;
  durationMinutes: number;
  price: number;
  color?: string;
  [key: string]: any;
}

export interface UpdateServiceInput {
  name?: string;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
  color?: string;
  [key: string]: any;
}
