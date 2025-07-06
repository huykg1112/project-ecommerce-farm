import { activeIngredientAPI } from "@/lib/mock/server"

export interface ActiveIngredientFilters {
  search?: string
  status?: string
  hazard_level?: string
  page?: number
  limit?: number
}

export interface CreateActiveIngredientRequest {
  ingredient_name: string
  description: string
  hazard_level: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  chemical_formula?: string
  cas_number?: string
  is_active?: boolean
}

export interface UpdateActiveIngredientRequest {
  ingredient_id: string
  ingredient_name?: string
  description?: string
  hazard_level?: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  chemical_formula?: string
  cas_number?: string
  is_active?: boolean
}

export const activeIngredientService = {
  async getActiveIngredients(filters: ActiveIngredientFilters = {}) {
    return activeIngredientAPI.getActiveIngredients(filters)
  },

  async getActiveIngredientById(ingredientId: string) {
    return activeIngredientAPI.getActiveIngredientById(ingredientId)
  },

  async createActiveIngredient(ingredientData: CreateActiveIngredientRequest) {
    return activeIngredientAPI.createActiveIngredient(ingredientData)
  },

  async updateActiveIngredient(ingredientData: UpdateActiveIngredientRequest) {
    return activeIngredientAPI.updateActiveIngredient(ingredientData)
  },

  async deleteActiveIngredient(ingredientId: string) {
    return activeIngredientAPI.deleteActiveIngredient(ingredientId)
  },

  async toggleActiveIngredientStatus(ingredientId: string) {
    return activeIngredientAPI.toggleActiveIngredientStatus(ingredientId)
  },
}
