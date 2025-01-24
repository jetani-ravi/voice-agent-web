export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

export interface SortParams {
  sort?: string;
  order?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams, SortParams {
  search?: string;
}

export function createPaginationParams(params: PaginationParams): {
  skip: number;
  limit: number;
} {
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.limit) || 10;

  return {
    skip: (currentPage - 1) * pageSize,
    limit: pageSize,
  };
}

export function createSortParams(params: SortParams): {
  sort?: string;
  order?: "asc" | "desc";
} {
  return {
    sort: params.sort,
    order: params.order,
  };
}

export function createSearchParams(params: SearchParams): {
  skip: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
} {
  return {
    ...createPaginationParams(params),
    ...createSortParams(params),
    search: params.search,
  };
}

export function createParams(
  params: SearchParams | Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
}
