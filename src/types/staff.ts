export interface CreateStaffInput {
  firstName: string;
  lastName: string;
  specialization?: string;
  avatarUrl?: string;
  services?: string[];
}

export interface UpdateStaffInput {
  firstName?: string;
  lastName?: string;
  specialization?: string;
  avatarUrl?: string;
  isActive?: boolean;
  services?: string[];
}
