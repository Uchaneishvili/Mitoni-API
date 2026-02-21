export interface CreateStaffInput {
  firstName: string;
  lastName: string;
  specialization: string;
}

export interface UpdateStaffInput {
  firstName?: string;
  lastName?: string;
  specialization?: string;
  isActive?: boolean;
}
