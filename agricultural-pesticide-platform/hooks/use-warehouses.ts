"use client"

import { useCallback, useEffect } from "react"
import { useAtom } from "jotai"
import {
  warehouseFiltersAtom,
  warehousesDataAtom,
  distributorsDataAtom,
  warehousesLoadingAtom,
  warehousesPaginationAtom,
  warehouseFormDataAtom,
  addWarehouseModalAtom,
  editWarehouseModalAtom,
  deleteWarehouseModalAtom,
  selectedWarehouseIdAtom,
  resetWarehouseFormAtom,
  type WarehouseFilters,
  type WarehouseFormData,
} from "@/lib/store/warehouse-store"
import { WarehouseService } from "@/lib/services/warehouse-service"
import { useToast } from "@/hooks/use-toast"

export function useWarehouses() {
  const [filters, setFilters] = useAtom(warehouseFiltersAtom)
  const [warehouses, setWarehouses] = useAtom(warehousesDataAtom)
  const [distributors, setDistributors] = useAtom(distributorsDataAtom)
  const [loading, setLoading] = useAtom(warehousesLoadingAtom)
  const [pagination, setPagination] = useAtom(warehousesPaginationAtom)
  const { toast } = useToast()

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await WarehouseService.getWarehouses(filters)
      setWarehouses(response.data)
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách kho hàng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, setLoading, setWarehouses, setPagination, toast])

  const fetchDistributors = useCallback(async () => {
    try {
      const distributorsList = await WarehouseService.getDistributors()
      setDistributors(distributorsList)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhà phân phối",
        variant: "destructive",
      })
    }
  }, [setDistributors, toast])

  const updateFilters = useCallback(
    (newFilters: Partial<WarehouseFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    },
    [setFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      distributor: "",
      page: 1,
      limit: 10,
    })
  }, [setFilters])

  const toggleWarehouseLock = useCallback(
    async (warehouseId: string) => {
      try {
        await WarehouseService.toggleWarehouseLock(warehouseId)
        await fetchWarehouses()
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái kho hàng",
        })
      } catch (error) {
        toast({
          title: "Lỗi",
          description: error instanceof Error ? error.message : "Không thể cập nhật trạng thái kho hàng",
          variant: "destructive",
        })
      }
    },
    [fetchWarehouses, toast],
  )

  useEffect(() => {
    fetchWarehouses()
  }, [fetchWarehouses])

  useEffect(() => {
    fetchDistributors()
  }, [fetchDistributors])

  return {
    warehouses,
    distributors,
    loading,
    pagination,
    filters,
    fetchWarehouses,
    updateFilters,
    resetFilters,
    toggleWarehouseLock,
  }
}

export function useWarehouseForm() {
  const [formData, setFormData] = useAtom(warehouseFormDataAtom)
  const [addModalOpen, setAddModalOpen] = useAtom(addWarehouseModalAtom)
  const [editModalOpen, setEditModalOpen] = useAtom(editWarehouseModalAtom)
  const [deleteModalOpen, setDeleteModalOpen] = useAtom(deleteWarehouseModalAtom)
  const [selectedWarehouseId, setSelectedWarehouseId] = useAtom(selectedWarehouseIdAtom)
  const [, resetForm] = useAtom(resetWarehouseFormAtom)
  const { toast } = useToast()

  const updateFormData = useCallback(
    (data: Partial<WarehouseFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }))
    },
    [setFormData],
  )

  const openAddModal = useCallback(() => {
    resetForm()
    setAddModalOpen(true)
  }, [resetForm, setAddModalOpen])

  const openEditModal = useCallback(
    async (warehouseId: string) => {
      try {
        const warehouse = await WarehouseService.getWarehouseById(warehouseId)
        if (warehouse) {
          setFormData({
            invenstory_id: warehouse.invenstory_id,
            distributor_id: warehouse.distributor.user_id,
            name: warehouse.name,
            business_license: warehouse.business_license,
            invenstory_address: warehouse.invenstory_address,
            invenstory_lat: warehouse.invenstory_lat,
            invenstory_lng: warehouse.invenstory_lng,
            invenstory_img: warehouse.invenstory_img,
            is_locked: warehouse.is_locked,
          })
          setSelectedWarehouseId(warehouseId)
          setEditModalOpen(true)
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin kho hàng",
          variant: "destructive",
        })
      }
    },
    [setFormData, setSelectedWarehouseId, setEditModalOpen, toast],
  )

  const openDeleteModal = useCallback(
    (warehouseId: string) => {
      setSelectedWarehouseId(warehouseId)
      setDeleteModalOpen(true)
    },
    [setSelectedWarehouseId, setDeleteModalOpen],
  )

  const closeModals = useCallback(() => {
    setAddModalOpen(false)
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedWarehouseId("")
    resetForm()
  }, [setAddModalOpen, setEditModalOpen, setDeleteModalOpen, setSelectedWarehouseId, resetForm])

  const createWarehouse = useCallback(async () => {
    try {
      await WarehouseService.createWarehouse({
        distributor_id: formData.distributor_id,
        name: formData.name,
        business_license: formData.business_license,
        invenstory_address: formData.invenstory_address,
        invenstory_lat: formData.invenstory_lat,
        invenstory_lng: formData.invenstory_lng,
        invenstory_img: formData.invenstory_img,
      })

      toast({
        title: "Thành công",
        description: "Đã tạo kho hàng mới",
      })

      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tạo kho hàng",
        variant: "destructive",
      })
      return false
    }
  }, [formData, toast])

  const updateWarehouse = useCallback(async () => {
    if (!formData.invenstory_id) return false

    try {
      await WarehouseService.updateWarehouse({
        invenstory_id: formData.invenstory_id,
        name: formData.name,
        business_license: formData.business_license,
        invenstory_address: formData.invenstory_address,
        invenstory_lat: formData.invenstory_lat,
        invenstory_lng: formData.invenstory_lng,
        invenstory_img: formData.invenstory_img,
        is_locked: formData.is_locked,
      })

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin kho hàng",
      })

      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật kho hàng",
        variant: "destructive",
      })
      return false
    }
  }, [formData, toast])

  const deleteWarehouse = useCallback(async () => {
    if (!selectedWarehouseId) return false

    try {
      await WarehouseService.deleteWarehouse(selectedWarehouseId)

      toast({
        title: "Thành công",
        description: "Đã xóa kho hàng",
      })

      return true
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa kho hàng",
        variant: "destructive",
      })
      return false
    }
  }, [selectedWarehouseId, toast])

  return {
    formData,
    updateFormData,
    addModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedWarehouseId,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  }
}
