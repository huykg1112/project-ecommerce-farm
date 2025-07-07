export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Pagination Type
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}
