import { storeRequestAPI, type StoreRequestFilters } from "@/lib/mock/server"
import type { StoreOwnerRequest } from "@/types/entities"

export class StoreRequestService {
  static async getStoreRequests(filters: StoreRequestFilters) {
    try {
      return await storeRequestAPI.getStoreRequests(filters)
    } catch (error) {
      throw new Error("Không thể tải danh sách yêu cầu")
    }
  }

  static async approveRequest(requestId: string): Promise<StoreOwnerRequest> {
    try {
      return await storeRequestAPI.approveStoreRequest(requestId)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Không thể phê duyệt yêu cầu")
    }
  }

  static async rejectRequest(requestId: string, reason: string): Promise<StoreOwnerRequest> {
    try {
      return await storeRequestAPI.rejectStoreRequest(requestId, reason)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Không thể từ chối yêu cầu")
    }
  }
}
