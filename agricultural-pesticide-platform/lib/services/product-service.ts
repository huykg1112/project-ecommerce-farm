import { productAPI } from "@/lib/mock/server"

export interface ProductFilters {
  search?: string
  status?: string
  category?: string
  distributor?: string
  price_min?: number
  price_max?: number
  page?: number
  limit?: number
}

export interface CreateProductRequest {
  distributor_id: string
  category_ids: string[]
  product_name: string
  description: string
  usage_instructions: string
  unit_product_price: number
  is_active?: boolean
}

export interface UpdateProductRequest {
  product_id: string
  category_ids?: string[]
  product_name?: string
  description?: string
  usage_instructions?: string
  unit_product_price?: number
  is_active?: boolean
}

export interface ProductIngredientRequest {
  product_id: string
  ingredient_id: string
  concentration: number
  is_primary: boolean
}

export interface ProductDiseaseRequest {
  product_id: string
  disease_id: string
  is_primary: boolean
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    return productAPI.getProducts(filters)
  },

  async getProductById(productId: string) {
    return productAPI.getProductById(productId)
  },

  async createProduct(productData: CreateProductRequest) {
    return productAPI.createProduct(productData)
  },

  async updateProduct(productData: UpdateProductRequest) {
    return productAPI.updateProduct(productData)
  },

  async deleteProduct(productId: string) {
    return productAPI.deleteProduct(productId)
  },

  async toggleProductStatus(productId: string) {
    return productAPI.toggleProductStatus(productId)
  },

  // Product-Ingredient relationships
  async addProductIngredient(data: ProductIngredientRequest) {
    return productAPI.addProductIngredient(data)
  },

  async updateProductIngredient(productIngredientId: string, data: Partial<ProductIngredientRequest>) {
    return productAPI.updateProductIngredient(productIngredientId, data)
  },

  async removeProductIngredient(productIngredientId: string) {
    return productAPI.removeProductIngredient(productIngredientId)
  },

  // Product-Disease relationships
  async addProductDisease(data: ProductDiseaseRequest) {
    return productAPI.addProductDisease(data)
  },

  async updateProductDisease(productDiseaseId: string, data: Partial<ProductDiseaseRequest>) {
    return productAPI.updateProductDisease(productDiseaseId, data)
  },

  async removeProductDisease(productDiseaseId: string) {
    return productAPI.removeProductDisease(productDiseaseId)
  },

  // Product images
  async addProductImage(productId: string, imageUrl: string, isPrimary = false, altText?: string) {
    return productAPI.addProductImage(productId, imageUrl, isPrimary, altText)
  },

  async updateProductImage(imageId: string, imageUrl?: string, isPrimary?: boolean, altText?: string) {
    return productAPI.updateProductImage(imageId, imageUrl, isPrimary, altText)
  },

  async removeProductImage(imageId: string) {
    return productAPI.removeProductImage(imageId)
  },
}
