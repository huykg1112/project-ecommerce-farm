import {
  warehouseAPI,
  type WarehouseFilters,
  type CreateWarehouseRequest,
  type UpdateWarehouseRequest,
} from "@/lib/mock/server"
import type { Invenstory, User } from "@/types/entities"

export class WarehouseService {
  static async getWarehouses(filters: WarehouseFilters) {
    try {
      return await warehouseAPI.getWarehouses(filters)
    } catch (error) {
      throw new Error("Không thể tải danh sách kho hàng")
    }
  }

  static async getWarehouseById(warehouseId: string): Promise<Invenstory | null> {
    try {
      return await warehouseAPI.getWarehouseById(warehouseId)
    } catch (error) {
      throw new Error("Không thể tải thông tin kho hàng")
    }
  }

  static async createWarehouse(warehouseData: CreateWarehouseRequest): Promise<Invenstory> {
    try {
      return await warehouseAPI.createWarehouse(warehouseData)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Không thể tạo kho hàng mới")
    }
  }

  static async updateWarehouse(warehouseData: UpdateWarehouseRequest): Promise<Invenstory> {
    try {
      return await warehouseAPI.updateWarehouse(warehouseData)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Không thể cập nhật thông tin kho hàng")
    }
  }

  static async deleteWarehouse(warehouseId: string): Promise<boolean> {
    try {
      return await warehouseAPI.deleteWarehouse(warehouseId)
    } catch (error) {
      throw new Error("Không thể xóa kho hàng")
    }
  }

  static async toggleWarehouseLock(warehouseId: string): Promise<Invenstory> {
    try {
      return await warehouseAPI.toggleWarehouseLock(warehouseId)
    } catch (error) {
      throw new Error("Không thể cập nhật trạng thái khóa kho hàng")
    }
  }

  static async getDistributors(): Promise<User[]> {
    try {
      return await warehouseAPI.getDistributors()
    } catch (error) {
      throw new Error("Không thể tải danh sách nhà phân phối")
    }
  }
}
