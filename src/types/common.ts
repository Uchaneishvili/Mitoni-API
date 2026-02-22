export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  order: "asc" | "desc";
}

export interface QueryOptions {
  pagination?: PaginationOptions;
  sort?: SortOptions;
  filter?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
