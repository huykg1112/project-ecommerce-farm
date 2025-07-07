// Base Response Type
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

// User Types
export interface User {
  user_id: string;
  full_name: string;
  username: string;
  cccd: string;
  address: string;
  email: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  ADMIN = "Admin",
  DISTRIBUTOR = "Distributor",
  CUSTOMER = "Client",
}

// User DTOs
export interface CreateUserDto {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  cccd: string;
  address: string;
  role: UserRole;
  password: string;
  is_active?: boolean;
}

export interface UpdateUserDto {
  username?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  cccd?: string;
  address?: string;
  role?: UserRole;
  is_active?: boolean;
  password?: string;
}

// User Filters
export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: "active" | "inactive";
  page: number;
  limit: number;
}

// User Actions
export type UserAction =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SELECTED_USERS"; payload: string[] }
  | { type: "SET_PAGINATION"; payload: Partial<PaginatedResponse<User>> }
  | { type: "SET_FILTERS"; payload: Partial<UserFilters> }
  | { type: "RESET_FILTERS" };
