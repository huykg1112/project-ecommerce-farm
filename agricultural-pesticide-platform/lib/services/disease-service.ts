import { diseaseAPI } from "@/lib/mock/server"

export interface DiseaseFilters {
  search?: string
  status?: string
  affected_crop?: string
  page?: number
  limit?: number
}

export interface CreateDiseaseRequest {
  disease_name: string
  description: string
  scientific_name?: string
  affected_crops: string[]
  symptoms: string
  prevention_tips?: string
  is_active?: boolean
}

export interface UpdateDiseaseRequest {
  disease_id: string
  disease_name?: string
  description?: string
  scientific_name?: string
  affected_crops?: string[]
  symptoms?: string
  prevention_tips?: string
  is_active?: boolean
}

export const diseaseService = {
  async getDiseases(filters: DiseaseFilters = {}) {
    return diseaseAPI.getDiseases(filters)
  },

  async getDiseaseById(diseaseId: string) {
    return diseaseAPI.getDiseaseById(diseaseId)
  },

  async createDisease(diseaseData: CreateDiseaseRequest) {
    return diseaseAPI.createDisease(diseaseData)
  },

  async updateDisease(diseaseData: UpdateDiseaseRequest) {
    return diseaseAPI.updateDisease(diseaseData)
  },

  async deleteDisease(diseaseId: string) {
    return diseaseAPI.deleteDisease(diseaseId)
  },

  async toggleDiseaseStatus(diseaseId: string) {
    return diseaseAPI.toggleDiseaseStatus(diseaseId)
  },

  async getAffectedCrops() {
    return diseaseAPI.getAffectedCrops()
  },
}
