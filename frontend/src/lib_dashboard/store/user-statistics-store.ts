import type { User } from "@/types/entities";
import { atom } from "jotai";

export type TimeRange = "month" | "year" | "custom";
export type UserRole = "all" | "Client" | "Distributor" | "Admin";
export type UserStatus = "all" | "active" | "inactive";

export interface UserStatisticsFilters {
  timeRange: TimeRange;
  selectedMonth?: number; // Thêm trường để lưu tháng được chọn (1-12)
  selectedYear?: number; // Thêm trường để lưu năm được chọn
  startDate?: Date;
  endDate?: Date;
  role: UserRole;
  status: UserStatus;
}

export interface ChartVisibility {
  customers: boolean;
  distributors: boolean;
}

export interface RegistrationData {
  period: string;
  customers: number;
  distributors: number;
  total: number;
}

export interface RoleDistribution {
  name: string;
  value: number;
  percentage: number;
  fill: string;
}

export interface UserStatisticsData {
  registrationTrends: RegistrationData[];
  roleDistribution: RoleDistribution[];
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  newUsersThisYear: number;
  filteredUsers: User[];
}

// Filter state
export const userStatisticsFiltersAtom = atom<UserStatisticsFilters>({
  timeRange: "year",
  selectedYear: new Date().getFullYear(), // Mặc định là năm hiện tại
  role: "all",
  status: "all",
});

// Chart visibility state
export const chartVisibilityAtom = atom<ChartVisibility>({
  customers: true,
  distributors: true,
});

// Statistics data state
export const userStatisticsDataAtom = atom<UserStatisticsData>({
  registrationTrends: [],
  roleDistribution: [],
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  newUsersThisMonth: 0,
  newUsersThisYear: 0,
  filteredUsers: [],
});

// Loading state
export const userStatisticsLoadingAtom = atom<boolean>(false);
