import type { QueryOptions } from "../types/common";

export class QueryBuilder {
  private options: QueryOptions = {};
  private query: Record<string, unknown>;

  constructor(query: Record<string, unknown>) {
    this.query = query;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    this.options.pagination = { page, limit };
    return this;
  }

  sort(): this {
    if (this.query.sort && typeof this.query.sort === "string") {
      const [field, order] = this.query.sort.split(":");
      if (field && (order === "asc" || order === "desc")) {
        this.options.sort = { field, order };
        return this;
      }
    }

    const sortBy = this.query.sortBy as string | undefined;
    const sortOrderRaw = this.query.sortOrder as string | undefined;

    if (sortBy) {
      let order: "asc" | "desc" = "asc";
      if (sortOrderRaw === "descend" || sortOrderRaw === "desc") {
        order = "desc";
      }
      this.options.sort = { field: sortBy, order };
    }

    return this;
  }

  private parseFilterValue(value: unknown): unknown {
    if (typeof value === "string" && value.includes(",")) {
      return this.parseFilterValue(value.split(","));
    }
    if (Array.isArray(value)) {
      if (value.length === 1) return this.parseFilterValue(value[0]);

      const parsedValues = value.map((v) => this.parseFilterValue(v));

      if (parsedValues.every((v) => typeof v === "boolean")) {
        return undefined;
      }

      return { in: parsedValues };
    }
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }

  filter(allowedFields: string[]): this {
    const filter: Record<string, unknown> = {};

    allowedFields.forEach((field) => {
      if (this.query[field] !== undefined) {
        filter[field] = this.parseFilterValue(this.query[field]);
      }
    });

    if (
      this.query.filters &&
      typeof this.query.filters === "object" &&
      !Array.isArray(this.query.filters)
    ) {
      const nestedFilters = this.query.filters as Record<string, unknown>;
      allowedFields.forEach((field) => {
        if (nestedFilters[field] !== undefined) {
          filter[field] = this.parseFilterValue(nestedFilters[field]);
        }
      });
    }

    this.options.filter = { ...this.options.filter, ...filter };
    return this;
  }

  search(searchFields: string[], paramName: string[] = ["search", "q"]): this {
    let searchTerm: string | undefined;

    for (const param of paramName) {
      if (this.query[param] && typeof this.query[param] === "string") {
        searchTerm = this.query[param] as string;
        break;
      }
    }

    if (searchTerm && searchFields.length > 0) {
      const searchFilter = {
        OR: searchFields.map((field) => {
          if (field.includes(".")) {
            const parts = field.split(".");

            const relation = parts[0] as string;
            const nestedField = parts[1] as string;

            return {
              [relation]: {
                some: {
                  [nestedField]: { contains: searchTerm, mode: "insensitive" },
                },
              },
            };
          }

          return {
            [field]: { contains: searchTerm, mode: "insensitive" },
          };
        }),
      };

      this.options.filter = { ...this.options.filter, ...searchFilter };
    }

    return this;
  }

  build(): QueryOptions {
    return this.options;
  }
}
