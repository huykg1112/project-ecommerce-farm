"use client";

import { showToast } from "@/lib/toast-provider";
import { manufacturerServiceManagement } from "@/lib_dashboard/services/manufacturers-service-management";
import {
  addManufacturerModalAtom,
  deleteManufacturerModalAtom,
  editManufacturerModalAtom,
  ManufacturerFilters,
  manufacturerFiltersAtom,
  manufacturerFormDataAtom,
  manufacturersDataAtom,
  manufacturersLoadingAtom,
  manufacturersPaginationAtom,
  resetManufacturerFormAtom,
  selectedManufacturerIdAtom,
  selectedManufacturersAtom,
  type ManufacturerFormData,
} from "@/lib_dashboard/store/manufacturer-store";
import type {
  CreateManufacturerRequest,
  Manufacturer,
} from "@/lib_dashboard/types/manufacturer";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

export function useManufacturers() {
  const [filters, setFilters] = useAtom(manufacturerFiltersAtom);
  const [manufacturers, setManufacturers] = useAtom(manufacturersDataAtom);
  const [loading, setLoading] = useAtom(manufacturersLoadingAtom);
  const [pagination, setPagination] = useAtom(manufacturersPaginationAtom);
  const [selectedManufacturers, setSelectedManufacturers] = useAtom(
    selectedManufacturersAtom
  );
  const [formData, setFormData] = useAtom(manufacturerFormDataAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addManufacturerModalAtom);
  const [editModalOpen, setEditModalOpen] = useAtom(editManufacturerModalAtom);
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(
    deleteManufacturerModalAtom
  );
  const [selectedManufacturerId, setSelectedManufacturerId] = useAtom(
    selectedManufacturerIdAtom
  );
  const resetForm = useSetAtom(resetManufacturerFormAtom);

  // Lưu toàn bộ manufacturers lấy từ API
  const allManufacturersRef = useRef<Manufacturer[]>([]);

  // Lọc và phân trang trên FE
  const filterAndPaginate = useCallback(() => {
    let filtered = allManufacturersRef.current;

    // Lọc theo search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (manufacturer) =>
          manufacturer.name.toLowerCase().includes(searchLower) ||
          manufacturer.description?.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo status
    if (filters.status) {
      filtered = filtered.filter((manufacturer) =>
        filters.status === "active"
          ? manufacturer.isActive
          : !manufacturer.isActive
      );
    }

    // Phân trang
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    setManufacturers(paginated);
    setPagination({
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }, [filters, setManufacturers, setPagination]);

  // Lấy danh sách nhà sản xuất từ API
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await manufacturerServiceManagement.getManufacturers();

      // Map backend data to frontend format
      const mappedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        logo: item.logo,
        logoPublicId: item.logoPublicId,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isDeleted: item.isDeleted,
      }));

      allManufacturersRef.current = mappedData;
      filterAndPaginate();
    } catch (error) {
      showToast.error("Không thể tải danh sách nhà sản xuất");
    } finally {
      setLoading(false);
    }
  }, [filterAndPaginate, setLoading]);

  // Cập nhật bộ lọc
  const updateFilters = useCallback(
    (newFilters: Partial<ManufacturerFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setSelectedManufacturers([]);
    },
    [setFilters, setSelectedManufacturers]
  );

  // Đặt lại bộ lọc
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      page: 1,
      limit: filters.limit,
    });
    setSelectedManufacturers([]);
  }, [setFilters, filters.limit, setSelectedManufacturers]);

  // Chọn/bỏ chọn một nhà sản xuất
  const toggleManufacturerSelection = useCallback(
    (manufacturerId: string) => {
      setSelectedManufacturers((prev) =>
        prev.includes(manufacturerId)
          ? prev.filter((id) => id !== manufacturerId)
          : [...prev, manufacturerId]
      );
    },
    [setSelectedManufacturers]
  );

  // Chọn/bỏ chọn tất cả nhà sản xuất trong trang hiện tại
  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedManufacturers(
        checked ? manufacturers.map((manufacturer) => manufacturer.id) : []
      );
    },
    [setSelectedManufacturers, manufacturers]
  );

  // Xóa danh sách chọn
  const clearSelection = useCallback(() => {
    setSelectedManufacturers([]);
  }, [setSelectedManufacturers]);

  // Thêm nhà sản xuất
  const addManufacturer = useCallback(
    async (data: ManufacturerFormData, logoFile?: File) => {
      try {
        if (logoFile) {
          const createData: CreateManufacturerRequest = {
            name: data.name,
            description: data.description,
          };
          await manufacturerServiceManagement.createManufacturerWithLogo(
            createData,
            logoFile
          );
        } else {
          const createData: CreateManufacturerRequest = {
            name: data.name,
            description: data.description,
          };
          await manufacturerServiceManagement.createManufacturer(createData);
        }
        showToast.success("Thêm nhà sản xuất thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể thêm nhà sản xuất");
        return false;
      }
    },
    [fetchList]
  );

  // Sửa nhà sản xuất
  const editManufacturer = useCallback(
    async (id: string, data: ManufacturerFormData, logoFile?: File) => {
      try {
        await manufacturerServiceManagement.updateManufacturer(id, data);

        // Nếu có logo mới, upload riêng
        if (logoFile) {
          await manufacturerServiceManagement.uploadManufacturerLogo(
            id,
            logoFile
          );
        }

        showToast.success("Cập nhật nhà sản xuất thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật nhà sản xuất");
        return false;
      }
    },
    [fetchList]
  );

  // Xóa nhà sản xuất
  const deleteManufacturer = useCallback(
    async (id: string) => {
      try {
        await manufacturerServiceManagement.deleteManufacturer(id);
        showToast.success("Xóa nhà sản xuất thành công");
        await fetchList();
        closeModals();
        return true;
      } catch (error) {
        showToast.error("Không thể xóa nhà sản xuất");
        return false;
      }
    },
    [fetchList]
  );

  // Bật/tắt trạng thái nhà sản xuất
  const toggleStatus = useCallback(
    async (id: string) => {
      try {
        await manufacturerServiceManagement.toggleManufacturerStatus(id);
        showToast.success("Cập nhật trạng thái nhà sản xuất thành công");
        await fetchList();
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái nhà sản xuất");
        return false;
      }
    },
    [fetchList]
  );

  // Bật/tắt trạng thái hàng loạt
  const batchToggleStatus = useCallback(
    async (status: boolean) => {
      try {
        await manufacturerServiceManagement.batchToggleStatus(
          selectedManufacturers,
          status
        );
        showToast.success(
          `Cập nhật trạng thái cho ${selectedManufacturers.length} nhà sản xuất thành công`
        );
        await fetchList();
        clearSelection();
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái hàng loạt");
      }
    },
    [selectedManufacturers, fetchList, clearSelection]
  );

  // Xóa hàng loạt
  const batchDeleteManufacturers = useCallback(async () => {
    try {
      await manufacturerServiceManagement.batchDeleteManufacturers(
        selectedManufacturers
      );
      showToast.success(
        `Xóa ${selectedManufacturers.length} nhà sản xuất thành công`
      );
      await fetchList();
      clearSelection();
    } catch (error) {
      showToast.error("Không thể xóa nhà sản xuất hàng loạt");
    }
  }, [selectedManufacturers, fetchList, clearSelection]);

  // Mở modal thêm
  const openAddModal = useCallback(() => {
    resetForm();
    setAddModalOpen(true);
  }, [resetForm, setAddModalOpen]);

  // Mở modal sửa
  const openEditModal = useCallback(
    async (manufacturerId: string) => {
      try {
        const manufacturer =
          await manufacturerServiceManagement.getManufacturerById(
            manufacturerId
          );
        if (manufacturer) {
          setFormData({
            id: manufacturer.id,
            name: manufacturer.name,
            description: manufacturer.description,
            logo: manufacturer.logo,
            isActive: manufacturer.isActive,
          });
          setEditModalOpen(true);
        }
      } catch (error) {
        showToast.error("Không thể tải thông tin nhà sản xuất");
      }
    },
    [setFormData, setEditModalOpen]
  );

  // Mở modal xóa
  const openDeleteModal = useCallback(
    (manufacturerId: string) => {
      setSelectedManufacturerId(manufacturerId);
      setDeleteModalOpen(true);
    },
    [setSelectedManufacturerId, setDeleteModalOpen]
  );

  // Đóng tất cả modal
  const closeModals = useCallback(() => {
    setAddModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedManufacturerId("");
    resetForm();
  }, [
    setAddModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setSelectedManufacturerId,
    resetForm,
  ]);

  // Effect để lọc lại dữ liệu khi filters thay đổi
  useEffect(() => {
    filterAndPaginate();
  }, [filterAndPaginate]);

  return {
    manufacturers,
    allManufacturers: allManufacturersRef.current,
    loading,
    pagination,
    filters,
    selectedManufacturers,
    formData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedManufacturerId,
    fetchList,
    updateFilters,
    resetFilters,
    toggleManufacturerSelection,
    toggleSelectAll,
    clearSelection,
    addManufacturer,
    editManufacturer,
    deleteManufacturer,
    toggleStatus,
    batchToggleStatus,
    batchDeleteManufacturers,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  };
}
