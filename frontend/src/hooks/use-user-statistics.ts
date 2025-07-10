"use client";

import { useToast } from "@/hooks/use-toast";
import { userServiceManagement } from "@/lib_dashboard/services/user-service-management";
import type {
  ChartVisibility,
  UserStatisticsData,
  UserStatisticsFilters,
} from "@/lib_dashboard/store/user-statistics-store";
import {
  chartVisibilityAtom,
  userStatisticsDataAtom,
  userStatisticsFiltersAtom,
  userStatisticsLoadingAtom,
} from "@/lib_dashboard/store/user-statistics-store";
import { User } from "@/types/entities";
import {
  addDays,
  differenceInDays,
  endOfMonth,
  isSameMonth,
  isSameYear,
  parseISO,
  startOfMonth,
} from "date-fns";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useUserStatistics = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useAtom(userStatisticsFiltersAtom);
  const [chartVisibility, setChartVisibility] = useAtom(chartVisibilityAtom);
  const [statisticsData, setStatisticsData] = useAtom(userStatisticsDataAtom);
  const [loading, setLoading] = useAtom(userStatisticsLoadingAtom);

  // Hàm xử lý thống kê từ danh sách user
  const processStatistics = (
    users: User[],
    filters: UserStatisticsFilters
  ): UserStatisticsData => {
    // Lọc theo role và status
    let filtered = users;
    if (filters.role !== "all") {
      let roleName = filters.role;
      filtered = filtered.filter((u) => u.role.role_name === roleName);
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((u) =>
        filters.status === "active" ? u.is_active : !u.is_active
      );
    }

    // Thống kê tổng số
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.is_active).length;
    const inactiveUsers = users.filter((u) => !u.is_active).length;

    // Thống kê số user mới trong tháng/năm hiện tại
    const now = new Date();
    const newUsersThisMonth = users.filter((u) =>
      u.created_at
        ? isSameMonth(parseISO(u.created_at.toString()), now) &&
          isSameYear(parseISO(u.created_at.toString()), now)
        : false
    ).length;
    const newUsersThisYear = users.filter((u) =>
      u.created_at ? isSameYear(parseISO(u.created_at.toString()), now) : false
    ).length;

    let registrationTrends: any[] = [];
    let roleDistribution: any[] = [];

    // Xử lý dữ liệu theo timeRange
    if (
      filters.timeRange === "month" &&
      filters.selectedMonth &&
      filters.selectedYear
    ) {
      // Lọc người dùng trong tháng được chọn
      const selectedDate = new Date(
        filters.selectedYear,
        filters.selectedMonth - 1,
        1
      );
      filtered = filtered.filter((u) =>
        u.created_at
          ? isSameMonth(parseISO(u.created_at.toString()), selectedDate) &&
            isSameYear(parseISO(u.created_at.toString()), selectedDate)
          : false
      );

      // Chia tháng thành 10 khoảng thời gian
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      const daysInMonth = differenceInDays(end, start) + 1;
      const interval = Math.ceil(daysInMonth / 10); // Khoảng thời gian cho mỗi mốc (3-4 ngày)

      for (let i = 0; i < 10; i++) {
        const intervalStart = addDays(start, i * interval);
        const intervalEnd = addDays(intervalStart, interval - 1);
        const countCustomer = filtered.filter(
          (u) =>
            u.role.role_name === "Client" &&
            u.created_at &&
            parseISO(u.created_at.toString()) >= intervalStart &&
            parseISO(u.created_at.toString()) <= intervalEnd
        ).length;
        const countDistributor = filtered.filter(
          (u) =>
            u.role.role_name === "Distributor" &&
            u.created_at &&
            parseISO(u.created_at.toString()) >= intervalStart &&
            parseISO(u.created_at.toString()) <= intervalEnd
        ).length;
        registrationTrends.push({
          period: `${intervalStart.getDate()}-${intervalEnd.getDate()}/${
            filters.selectedMonth
          }`,
          customers: countCustomer,
          distributors: countDistributor,
          total: countCustomer + countDistributor,
        });
      }

      // Role distribution cho tháng được chọn
      const countClient = filtered.filter(
        (u) => u.role.role_name === "Client"
      ).length;
      const countDistributor = filtered.filter(
        (u) => u.role.role_name === "Distributor"
      ).length;
      roleDistribution = [
        {
          name: "Khách hàng",
          value: countClient,
          percentage:
            filtered.length > 0 ? (countClient / filtered.length) * 100 : 0,
          fill: "#8884d8",
        },
        {
          name: "Nhà phân phối",
          value: countDistributor,
          percentage:
            filtered.length > 0
              ? (countDistributor / filtered.length) * 100
              : 0,
          fill: "#82ca9d",
        },
      ];
    } else if (filters.timeRange === "year" && filters.selectedYear) {
      // Lọc người dùng trong năm được chọn
      filtered = filtered.filter((u) =>
        u.created_at
          ? isSameYear(
              parseISO(u.created_at.toString()),
              new Date(filters.selectedYear ?? 2025, 0, 1)
            )
          : false
      );

      // Chia năm thành 12 tháng
      for (let month = 0; month < 12; month++) {
        const countCustomer = filtered.filter(
          (u) =>
            u.role.role_name === "Client" &&
            u.created_at &&
            parseISO(u.created_at.toString()).getMonth() === month &&
            isSameYear(
              parseISO(u.created_at.toString()),
              new Date(filters.selectedYear ?? 2025, 0, 1)
            )
        ).length;
        const countDistributor = filtered.filter(
          (u) =>
            u.role.role_name === "Distributor" &&
            u.created_at &&
            parseISO(u.created_at.toString()).getMonth() === month &&
            isSameYear(
              parseISO(u.created_at.toString()),
              new Date(filters.selectedYear ?? 2025, 0, 1)
            )
        ).length;
        registrationTrends.push({
          period: `${month + 1}/${filters.selectedYear}`,
          customers: countCustomer,
          distributors: countDistributor,
          total: countCustomer + countDistributor,
        });
      }

      // Role distribution cho năm được chọn
      const countClient = filtered.filter(
        (u) => u.role.role_name === "Client"
      ).length;
      const countDistributor = filtered.filter(
        (u) => u.role.role_name === "Distributor"
      ).length;
      roleDistribution = [
        {
          name: "Khách hàng",
          value: countClient,
          percentage:
            filtered.length > 0 ? (countClient / filtered.length) * 100 : 0,
          fill: "#8884d8",
        },
        {
          name: "Nhà phân phối",
          value: countDistributor,
          percentage:
            filtered.length > 0
              ? (countDistributor / filtered.length) * 100
              : 0,
          fill: "#82ca9d",
        },
      ];
    } else if (
      filters.timeRange === "custom" &&
      filters.startDate &&
      filters.endDate
    ) {
      // Lọc người dùng trong khoảng thời gian tùy chỉnh
      filtered = filtered.filter((u) =>
        u.created_at && filters.startDate && filters.endDate
          ? parseISO(u.created_at.toString()) >= filters.startDate &&
            parseISO(u.created_at.toString()) <= filters.endDate
          : false
      );

      // Chia khoảng thời gian thành 10 phần
      const days = differenceInDays(filters.endDate, filters.startDate) + 1;
      const interval = Math.ceil(days / 10); // Khoảng thời gian cho mỗi mốc
      for (let i = 0; i < 10; i++) {
        const intervalStart = addDays(filters.startDate, i * interval);
        const intervalEnd = addDays(intervalStart, interval - 1);
        const countCustomer = filtered.filter(
          (u) =>
            u.role.role_name === "Client" &&
            u.created_at &&
            parseISO(u.created_at.toString()) >= intervalStart &&
            parseISO(u.created_at.toString()) <= intervalEnd
        ).length;
        const countDistributor = filtered.filter(
          (u) =>
            u.role.role_name === "Distributor" &&
            u.created_at &&
            parseISO(u.created_at.toString()) >= intervalStart &&
            parseISO(u.created_at.toString()) <= intervalEnd
        ).length;
        registrationTrends.push({
          period: `${intervalStart.toLocaleDateString(
            "vi-VN"
          )}-${intervalEnd.toLocaleDateString("vi-VN")}`,
          customers: countCustomer,
          distributors: countDistributor,
          total: countCustomer + countDistributor,
        });
      }

      // Role distribution cho khoảng thời gian tùy chỉnh
      const countClient = filtered.filter(
        (u) => u.role.role_name === "Client"
      ).length;
      const countDistributor = filtered.filter(
        (u) => u.role.role_name === "Distributor"
      ).length;
      roleDistribution = [
        {
          name: "Khách hàng",
          value: countClient,
          percentage:
            filtered.length > 0 ? (countClient / filtered.length) * 100 : 0,
          fill: "#8884d8",
        },
        {
          name: "Nhà phân phối",
          value: countDistributor,
          percentage:
            filtered.length > 0
              ? (countDistributor / filtered.length) * 100
              : 0,
          fill: "#82ca9d",
        },
      ];
    } else {
      // Mặc định: Thống kê cho năm hiện tại (12 tháng)
      for (let month = 0; month < 12; month++) {
        const countCustomer = filtered.filter(
          (u) =>
            u.role.role_name === "Client" &&
            u.created_at &&
            parseISO(u.created_at.toString()).getMonth() === month &&
            isSameYear(parseISO(u.created_at.toString()), now)
        ).length;
        const countDistributor = filtered.filter(
          (u) =>
            u.role.role_name === "Distributor" &&
            u.created_at &&
            parseISO(u.created_at.toString()).getMonth() === month &&
            isSameYear(parseISO(u.created_at.toString()), now)
        ).length;
        registrationTrends.push({
          period: `${month + 1}/${now.getFullYear()}`,
          customers: countCustomer,
          distributors: countDistributor,
          total: countCustomer + countDistributor,
        });
      }

      // Role distribution mặc định (cho tất cả dữ liệu đã lọc)
      const countClient = filtered.filter(
        (u) => u.role.role_name === "Client"
      ).length;
      const countDistributor = filtered.filter(
        (u) => u.role.role_name === "Distributor"
      ).length;
      roleDistribution = [
        {
          name: "Khách hàng",
          value: countClient,
          percentage:
            filtered.length > 0 ? (countClient / filtered.length) * 100 : 0,
          fill: "#8884d8",
        },
        {
          name: "Nhà phân phối",
          value: countDistributor,
          percentage:
            filtered.length > 0
              ? (countDistributor / filtered.length) * 100
              : 0,
          fill: "#82ca9d",
        },
      ];
    }

    return {
      registrationTrends,
      roleDistribution,
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
      newUsersThisYear,
      filteredUsers: filtered,
    };
  };

  // Fetch statistics data từ backend
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const users = await userServiceManagement.getUsers();
      const stats = processStatistics(users, filters);
      setStatisticsData(stats);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể tải thống kê người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, setStatisticsData, setLoading, toast]);

  // Auto-fetch when filters change
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Filter operations
  const updateFilters = useCallback(
    (newFilters: Partial<UserStatisticsFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      timeRange: "year",
      selectedYear: new Date().getFullYear(),
      role: "all",
      status: "all",
    });
  }, [setFilters]);

  // Chart visibility operations
  const updateChartVisibility = useCallback(
    (newVisibility: Partial<ChartVisibility>) => {
      setChartVisibility((prev) => ({ ...prev, ...newVisibility }));
    },
    [setChartVisibility]
  );

  const toggleRoleVisibility = useCallback(
    (role: keyof ChartVisibility) => {
      setChartVisibility((prev) => ({ ...prev, [role]: !prev[role] }));
    },
    [setChartVisibility]
  );

  return {
    // Data
    filters,
    chartVisibility,
    statisticsData,
    loading,

    // Operations
    updateFilters,
    resetFilters,
    updateChartVisibility,
    toggleRoleVisibility,
    fetchStatistics,
  };
};
