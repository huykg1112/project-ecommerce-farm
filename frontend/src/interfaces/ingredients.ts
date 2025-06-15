export interface Ingredient {
      id: string
      name: string
      description?: string
      unit: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
}

export interface IngredientStatistics {
      totalIngredients: number
      activeIngredients: number
      inactiveIngredients: number
      ingredientsInUse: number
      pieChart: {
            label: string
            value: number
      }[]
      barChart: {
            label: string
            value: number
      }[]
}