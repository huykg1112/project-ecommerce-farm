import type {
  User,
  StoreOwnerRequest,
  Category,
  Invenstory,
  Disease,
  ActiveIngredient,
  Product,
  ProductIngredient,
  ProductDisease,
  ProductImage,
} from "@/types/entities"
import { mockUsersData } from "./users"
import { mockStoreRequests } from "./store-requests"
import { mockCategoriesData } from "./categories"
import { mockWarehousesData } from "./warehouses"
import { mockDiseasesData } from "./diseases"
import { mockActiveIngredientsData } from "./active-ingredients"
import {
  mockProductsData,
  mockProductIngredientsData,
  mockProductDiseasesData,
  mockProductImagesData,
} from "./products"

export interface UserFilters {
  search?: string
  role?: string
  status?: string
  page?: number
  limit?: number
}

export interface CategoryFilters {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface WarehouseFilters {
  search?: string
  status?: string
  distributor?: string
  page?: number
  limit?: number
}

export interface DiseaseFilters {
  search?: string
  status?: string
  affected_crop?: string
  page?: number
  limit?: number
}

export interface ActiveIngredientFilters {
  search?: string
  status?: string
  hazard_level?: string
  page?: number
  limit?: number
}

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

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateUserRequest {
  username: string
  email: string
  full_name: string
  phone_number: string
  role_name: "ADMIN" | "DISTRIBUTOR" | "CUSTOMER"
  cccd?: string
  password: string
}

export interface UpdateUserRequest {
  user_id: string
  username?: string
  email?: string
  full_name?: string
  phone_number?: string
  role_name?: "ADMIN" | "DISTRIBUTOR" | "CUSTOMER"
  cccd?: string
  is_active?: boolean
}

export interface CreateCategoryRequest {
  category_name: string
  description: string
  category_img?: string
  is_active?: boolean
}

export interface UpdateCategoryRequest {
  category_id: string
  category_name?: string
  description?: string
  category_img?: string
  is_active?: boolean
}

export interface CreateWarehouseRequest {
  distributor_id: string
  name: string
  business_license: string
  invenstory_address: string
  invenstory_lat?: number
  invenstory_lng?: number
  invenstory_img?: string
}

export interface UpdateWarehouseRequest {
  invenstory_id: string
  name?: string
  business_license?: string
  invenstory_address?: string
  invenstory_lat?: number
  invenstory_lng?: number
  invenstory_img?: string
  is_locked?: boolean
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

export interface StoreRequestFilters {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface ApprovalAction {
  request_id: string
  action: "approve" | "reject"
  reason?: string
}

// In-memory storage for mock data
let users = [...mockUsersData]
const categories = [...mockCategoriesData]
const warehouses = [...mockWarehousesData]
const diseases = [...mockDiseasesData]
const activeIngredients = [...mockActiveIngredientsData]
const products = [...mockProductsData]
const productIngredients = [...mockProductIngredientsData]
const productDiseases = [...mockProductDiseasesData]
const productImages = [...mockProductImagesData]

// In-memory storage for store requests
const storeRequests = [...mockStoreRequests]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

export const userAPI = {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    await delay(300)

    const { search = "", role = "", status = "", page = 1, limit = 10 } = filters

    let filteredUsers = [...users]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.full_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone_number.includes(search) ||
          user.username.toLowerCase().includes(searchLower),
      )
    }

    // Apply role filter
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role.role_name === role)
    }

    // Apply status filter
    if (status && status !== "all") {
      const isActive = status === "active"
      filteredUsers = filteredUsers.filter((user) => user.is_active === isActive)
    }

    // Sort by creation date (newest first)
    filteredUsers.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    // Calculate pagination
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async getUserById(userId: string): Promise<User | null> {
    await delay(200)
    return users.find((user) => user.user_id === userId) || null
  },

  async createUser(userData: CreateUserRequest): Promise<User> {
    await delay(400)

    // Check if username or email already exists
    const existingUser = users.find((user) => user.username === userData.username || user.email === userData.email)

    if (existingUser) {
      throw new Error("Tên đăng nhập hoặc email đã tồn tại")
    }

    const roleMap = {
      ADMIN: { role_id: "1", description: "Quản trị viên hệ thống" },
      DISTRIBUTOR: { role_id: "2", description: "Nhà phân phối" },
      CUSTOMER: { role_id: "3", description: "Khách hàng" },
    }

    const newUser: User = {
      user_id: generateId(),
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      avatar: "/placeholder.svg",
      cccd: userData.cccd,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      role: {
        role_id: roleMap[userData.role_name].role_id,
        role_name: userData.role_name,
        description: roleMap[userData.role_name].description,
        is_active: true,
      },
    }

    users.unshift(newUser)
    return newUser
  },

  async updateUser(userData: UpdateUserRequest): Promise<User> {
    await delay(400)

    const userIndex = users.findIndex((user) => user.user_id === userData.user_id)
    if (userIndex === -1) {
      throw new Error("Không tìm thấy người dùng")
    }

    // Check for duplicate username/email if they're being updated
    if (userData.username || userData.email) {
      const existingUser = users.find(
        (user) =>
          user.user_id !== userData.user_id && (user.username === userData.username || user.email === userData.email),
      )

      if (existingUser) {
        throw new Error("Tên đăng nhập hoặc email đã tồn tại")
      }
    }

    const currentUser = users[userIndex]
    const updatedUser: User = {
      ...currentUser,
      username: userData.username ?? currentUser.username,
      email: userData.email ?? currentUser.email,
      full_name: userData.full_name ?? currentUser.full_name,
      phone_number: userData.phone_number ?? currentUser.phone_number,
      cccd: userData.cccd ?? currentUser.cccd,
      is_active: userData.is_active ?? currentUser.is_active,
      updated_at: new Date(),
    }

    // Update role if provided
    if (userData.role_name) {
      const roleMap = {
        ADMIN: { role_id: "1", description: "Quản trị viên hệ thống" },
        DISTRIBUTOR: { role_id: "2", description: "Nhà phân phối" },
        CUSTOMER: { role_id: "3", description: "Khách hàng" },
      }

      updatedUser.role = {
        role_id: roleMap[userData.role_name].role_id,
        role_name: userData.role_name,
        description: roleMap[userData.role_name].description,
        is_active: true,
      }
    }

    users[userIndex] = updatedUser
    return updatedUser
  },

  async deleteUser(userId: string): Promise<boolean> {
    await delay(300)

    const userIndex = users.findIndex((user) => user.user_id === userId)
    if (userIndex === -1) {
      throw new Error("Không tìm thấy người dùng")
    }

    users.splice(userIndex, 1)
    return true
  },

  async toggleUserStatus(userId: string): Promise<User> {
    await delay(200)

    const userIndex = users.findIndex((user) => user.user_id === userId)
    if (userIndex === -1) {
      throw new Error("Không tìm thấy người dùng")
    }

    users[userIndex].is_active = !users[userIndex].is_active
    users[userIndex].updated_at = new Date()

    return users[userIndex]
  },

  async batchToggleStatus(userIds: string[], status: boolean): Promise<User[]> {
    await delay(500)

    const updatedUsers: User[] = []

    userIds.forEach((userId) => {
      const userIndex = users.findIndex((user) => user.user_id === userId)
      if (userIndex !== -1) {
        users[userIndex].is_active = status
        users[userIndex].updated_at = new Date()
        updatedUsers.push(users[userIndex])
      }
    })

    return updatedUsers
  },

  async batchDeleteUsers(userIds: string[]): Promise<boolean> {
    await delay(600)

    users = users.filter((user) => !userIds.includes(user.user_id))
    return true
  },
}

export const categoryAPI = {
  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> {
    await delay(300)

    const { search = "", status = "", page = 1, limit = 10 } = filters

    let filteredCategories = [...categories]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCategories = filteredCategories.filter(
        (category) =>
          category.category_name.toLowerCase().includes(searchLower) ||
          category.description.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (status && status !== "all") {
      const isActive = status === "active"
      filteredCategories = filteredCategories.filter((category) => category.is_active === isActive)
    }

    // Sort by category name
    filteredCategories.sort((a, b) => a.category_name.localeCompare(b.category_name))

    // Calculate pagination
    const total = filteredCategories.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

    return {
      data: paginatedCategories,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async getCategoryById(categoryId: string): Promise<Category | null> {
    await delay(200)
    return categories.find((category) => category.category_id === categoryId) || null
  },

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    await delay(400)

    // Check if category name already exists
    const existingCategory = categories.find(
      (category) => category.category_name.toLowerCase() === categoryData.category_name.toLowerCase(),
    )

    if (existingCategory) {
      throw new Error("Tên danh mục đã tồn tại")
    }

    const newCategory: Category = {
      category_id: generateId(),
      category_name: categoryData.category_name,
      description: categoryData.description,
      category_img: categoryData.category_img,
      is_active: categoryData.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    categories.unshift(newCategory)
    return newCategory
  },

  async updateCategory(categoryData: UpdateCategoryRequest): Promise<Category> {
    await delay(400)

    const categoryIndex = categories.findIndex((category) => category.category_id === categoryData.category_id)
    if (categoryIndex === -1) {
      throw new Error("Không tìm thấy danh mục")
    }

    // Check for duplicate category name if it's being updated
    if (categoryData.category_name) {
      const existingCategory = categories.find(
        (category) =>
          category.category_id !== categoryData.category_id &&
          category.category_name.toLowerCase() === categoryData.category_name!.toLowerCase(),
      )

      if (existingCategory) {
        throw new Error("Tên danh mục đã tồn tại")
      }
    }

    const currentCategory = categories[categoryIndex]
    const updatedCategory: Category = {
      ...currentCategory,
      category_name: categoryData.category_name ?? currentCategory.category_name,
      description: categoryData.description ?? currentCategory.description,
      category_img: categoryData.category_img ?? currentCategory.category_img,
      is_active: categoryData.is_active ?? currentCategory.is_active,
      updated_at: new Date(),
    }

    categories[categoryIndex] = updatedCategory
    return updatedCategory
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    await delay(300)

    const categoryIndex = categories.findIndex((category) => category.category_id === categoryId)
    if (categoryIndex === -1) {
      throw new Error("Không tìm thấy danh mục")
    }

    categories.splice(categoryIndex, 1)
    return true
  },

  async toggleCategoryStatus(categoryId: string): Promise<Category> {
    await delay(200)

    const categoryIndex = categories.findIndex((category) => category.category_id === categoryId)
    if (categoryIndex === -1) {
      throw new Error("Không tìm thấy danh mục")
    }

    categories[categoryIndex].is_active = !categories[categoryIndex].is_active
    categories[categoryIndex].updated_at = new Date()

    return categories[categoryIndex]
  },
}

export const warehouseAPI = {
  async getWarehouses(filters: WarehouseFilters = {}): Promise<PaginatedResponse<Invenstory>> {
    await delay(300)

    const { search = "", status = "", distributor = "", page = 1, limit = 10 } = filters

    let filteredWarehouses = [...warehouses]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredWarehouses = filteredWarehouses.filter(
        (warehouse) =>
          warehouse.name.toLowerCase().includes(searchLower) ||
          warehouse.distributor.full_name.toLowerCase().includes(searchLower) ||
          warehouse.business_license.includes(search) ||
          warehouse.invenstory_address.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (status && status !== "all") {
      if (status === "active") {
        filteredWarehouses = filteredWarehouses.filter((warehouse) => !warehouse.is_locked)
      } else if (status === "locked") {
        filteredWarehouses = filteredWarehouses.filter((warehouse) => warehouse.is_locked)
      }
    }

    // Apply distributor filter
    if (distributor && distributor !== "all") {
      filteredWarehouses = filteredWarehouses.filter((warehouse) => warehouse.distributor.user_id === distributor)
    }

    // Sort by creation date (newest first)
    filteredWarehouses.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    // Calculate pagination
    const total = filteredWarehouses.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedWarehouses = filteredWarehouses.slice(startIndex, endIndex)

    return {
      data: paginatedWarehouses,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async getWarehouseById(warehouseId: string): Promise<Invenstory | null> {
    await delay(200)
    return warehouses.find((warehouse) => warehouse.invenstory_id === warehouseId) || null
  },

  async createWarehouse(warehouseData: CreateWarehouseRequest): Promise<Invenstory> {
    await delay(400)

    const distributor = users.find((user) => user.user_id === warehouseData.distributor_id)
    if (!distributor) {
      throw new Error("Không tìm thấy nhà phân phối")
    }

    // Check if distributor already has a warehouse
    const existingWarehouse = warehouses.find(
      (warehouse) => warehouse.distributor.user_id === warehouseData.distributor_id,
    )
    if (existingWarehouse) {
      throw new Error("Nhà phân phối đã có kho hàng")
    }

    const newWarehouse: Invenstory = {
      invenstory_id: generateId(),
      distributor,
      name: warehouseData.name,
      business_license: warehouseData.business_license,
      invenstory_address: warehouseData.invenstory_address,
      invenstory_lat: warehouseData.invenstory_lat,
      invenstory_lng: warehouseData.invenstory_lng,
      invenstory_img: warehouseData.invenstory_img,
      is_locked: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    warehouses.unshift(newWarehouse)
    return newWarehouse
  },

  async updateWarehouse(warehouseData: UpdateWarehouseRequest): Promise<Invenstory> {
    await delay(400)

    const warehouseIndex = warehouses.findIndex((warehouse) => warehouse.invenstory_id === warehouseData.invenstory_id)
    if (warehouseIndex === -1) {
      throw new Error("Không tìm thấy kho hàng")
    }

    const currentWarehouse = warehouses[warehouseIndex]
    const updatedWarehouse: Invenstory = {
      ...currentWarehouse,
      name: warehouseData.name ?? currentWarehouse.name,
      business_license: warehouseData.business_license ?? currentWarehouse.business_license,
      invenstory_address: warehouseData.invenstory_address ?? currentWarehouse.invenstory_address,
      invenstory_lat: warehouseData.invenstory_lat ?? currentWarehouse.invenstory_lat,
      invenstory_lng: warehouseData.invenstory_lng ?? currentWarehouse.invenstory_lng,
      invenstory_img: warehouseData.invenstory_img ?? currentWarehouse.invenstory_img,
      is_locked: warehouseData.is_locked ?? currentWarehouse.is_locked,
      updated_at: new Date(),
    }

    warehouses[warehouseIndex] = updatedWarehouse
    return updatedWarehouse
  },

  async deleteWarehouse(warehouseId: string): Promise<boolean> {
    await delay(300)

    const warehouseIndex = warehouses.findIndex((warehouse) => warehouse.invenstory_id === warehouseId)
    if (warehouseIndex === -1) {
      throw new Error("Không tìm thấy kho hàng")
    }

    warehouses.splice(warehouseIndex, 1)
    return true
  },

  async toggleWarehouseLock(warehouseId: string): Promise<Invenstory> {
    await delay(200)

    const warehouseIndex = warehouses.findIndex((warehouse) => warehouse.invenstory_id === warehouseId)
    if (warehouseIndex === -1) {
      throw new Error("Không tìm thấy kho hàng")
    }

    warehouses[warehouseIndex].is_locked = !warehouses[warehouseIndex].is_locked
    warehouses[warehouseIndex].updated_at = new Date()

    return warehouses[warehouseIndex]
  },

  async getDistributors(): Promise<User[]> {
    await delay(200)
    return users.filter((user) => user.role.role_name === "DISTRIBUTOR")
  },
}

export const diseaseAPI = {
  async getDiseases(filters: DiseaseFilters = {}): Promise<PaginatedResponse<Disease>> {
    await delay(300)

    const { search = "", status = "", affected_crop = "", page = 1, limit = 10 } = filters

    let filteredDiseases = [...diseases]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredDiseases = filteredDiseases.filter(
        (disease) =>
          disease.disease_name.toLowerCase().includes(searchLower) ||
          disease.description.toLowerCase().includes(searchLower) ||
          disease.scientific_name?.toLowerCase().includes(searchLower) ||
          disease.symptoms.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (status && status !== "all") {
      const isActive = status === "active"
      filteredDiseases = filteredDiseases.filter((disease) => disease.is_active === isActive)
    }

    // Apply affected crop filter
    if (affected_crop && affected_crop !== "all") {
      filteredDiseases = filteredDiseases.filter((disease) =>
        disease.affected_crops.some((crop) => crop.toLowerCase().includes(affected_crop.toLowerCase())),
      )
    }

    // Sort by disease name
    filteredDiseases.sort((a, b) => a.disease_name.localeCompare(b.disease_name))

    // Calculate pagination
    const total = filteredDiseases.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedDiseases = filteredDiseases.slice(startIndex, endIndex)

    return {
      data: paginatedDiseases,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async getDiseaseById(diseaseId: string): Promise<Disease | null> {
    await delay(200)
    return diseases.find((disease) => disease.disease_id === diseaseId) || null
  },

  async createDisease(diseaseData: CreateDiseaseRequest): Promise<Disease> {
    await delay(400)

    // Check if disease name already exists
    const existingDisease = diseases.find(
      (disease) => disease.disease_name.toLowerCase() === diseaseData.disease_name.toLowerCase(),
    )

    if (existingDisease) {
      throw new Error("Tên bệnh đã tồn tại")
    }

    const newDisease: Disease = {
      disease_id: generateId(),
      disease_name: diseaseData.disease_name,
      description: diseaseData.description,
      scientific_name: diseaseData.scientific_name,
      affected_crops: diseaseData.affected_crops,
      symptoms: diseaseData.symptoms,
      prevention_tips: diseaseData.prevention_tips,
      is_active: diseaseData.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    diseases.unshift(newDisease)
    return newDisease
  },

  async updateDisease(diseaseData: UpdateDiseaseRequest): Promise<Disease> {
    await delay(400)

    const diseaseIndex = diseases.findIndex((disease) => disease.disease_id === diseaseData.disease_id)
    if (diseaseIndex === -1) {
      throw new Error("Không tìm thấy bệnh")
    }

    // Check for duplicate disease name if it's being updated
    if (diseaseData.disease_name) {
      const existingDisease = diseases.find(
        (disease) =>
          disease.disease_id !== diseaseData.disease_id &&
          disease.disease_name.toLowerCase() === diseaseData.disease_name!.toLowerCase(),
      )

      if (existingDisease) {
        throw new Error("Tên bệnh đã tồn tại")
      }
    }

    const currentDisease = diseases[diseaseIndex]
    const updatedDisease: Disease = {
      ...currentDisease,
      disease_name: diseaseData.disease_name ?? currentDisease.disease_name,
      description: diseaseData.description ?? currentDisease.description,
      scientific_name: diseaseData.scientific_name ?? currentDisease.scientific_name,
      affected_crops: diseaseData.affected_crops ?? currentDisease.affected_crops,
      symptoms: diseaseData.symptoms ?? currentDisease.symptoms,
      prevention_tips: diseaseData.prevention_tips ?? currentDisease.prevention_tips,
      is_active: diseaseData.is_active ?? currentDisease.is_active,
      updated_at: new Date(),
    }

    diseases[diseaseIndex] = updatedDisease
    return updatedDisease
  },

  async deleteDisease(diseaseId: string): Promise<boolean> {
    await delay(300)

    const diseaseIndex = diseases.findIndex((disease) => disease.disease_id === diseaseId)
    if (diseaseIndex === -1) {
      throw new Error("Không tìm thấy bệnh")
    }

    diseases.splice(diseaseIndex, 1)
    return true
  },

  async toggleDiseaseStatus(diseaseId: string): Promise<Disease> {
    await delay(200)

    const diseaseIndex = diseases.findIndex((disease) => disease.disease_id === diseaseId)
    if (diseaseIndex === -1) {
      throw new Error("Không tìm thấy bệnh")
    }

    diseases[diseaseIndex].is_active = !diseases[diseaseIndex].is_active
    diseases[diseaseIndex].updated_at = new Date()

    return diseases[diseaseIndex]
  },

  async getAffectedCrops(): Promise<string[]> {
    await delay(100)
    const allCrops = diseases.flatMap((disease) => disease.affected_crops)
    return [...new Set(allCrops)].sort()
  },
}

export const activeIngredientAPI = {
  async getActiveIngredients(filters: ActiveIngredientFilters = {}): Promise<PaginatedResponse<ActiveIngredient>> {
    await delay(300)

    const { search = "", status = "", hazard_level = "", page = 1, limit = 10 } = filters

    let filteredIngredients = [...activeIngredients]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredIngredients = filteredIngredients.filter(
        (ingredient) =>
          ingredient.ingredient_name.toLowerCase().includes(searchLower) ||
          ingredient.description.toLowerCase().includes(searchLower) ||
          ingredient.chemical_formula?.toLowerCase().includes(searchLower) ||
          ingredient.cas_number?.includes(search),
      )
    }

    // Apply status filter
    if (status && status !== "all") {
      const isActive = status === "active"
      filteredIngredients = filteredIngredients.filter((ingredient) => ingredient.is_active === isActive)
    }

    // Apply hazard level filter
    if (hazard_level && hazard_level !== "all") {
      filteredIngredients = filteredIngredients.filter((ingredient) => ingredient.hazard_level === hazard_level)
    }

    // Sort by ingredient name
    filteredIngredients.sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name))

    // Calculate pagination
    const total = filteredIngredients.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedIngredients = filteredIngredients.slice(startIndex, endIndex)

    return {
      data: paginatedIngredients,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async getActiveIngredientById(ingredientId: string): Promise<ActiveIngredient | null> {
    await delay(200)
    return activeIngredients.find((ingredient) => ingredient.ingredient_id === ingredientId) || null
  },

  async createActiveIngredient(ingredientData: CreateActiveIngredientRequest): Promise<ActiveIngredient> {
    await delay(400)

    // Check if ingredient name already exists
    const existingIngredient = activeIngredients.find(
      (ingredient) => ingredient.ingredient_name.toLowerCase() === ingredientData.ingredient_name.toLowerCase(),
    )

    if (existingIngredient) {
      throw new Error("Tên hoạt chất đã tồn tại")
    }

    const newIngredient: ActiveIngredient = {
      ingredient_id: generateId(),
      ingredient_name: ingredientData.ingredient_name,
      description: ingredientData.description,
      hazard_level: ingredientData.hazard_level,
      chemical_formula: ingredientData.chemical_formula,
      cas_number: ingredientData.cas_number,
      is_active: ingredientData.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    activeIngredients.unshift(newIngredient)
    return newIngredient
  },

  async updateActiveIngredient(ingredientData: UpdateActiveIngredientRequest): Promise<ActiveIngredient> {
    await delay(400)

    const ingredientIndex = activeIngredients.findIndex(
      (ingredient) => ingredient.ingredient_id === ingredientData.ingredient_id,
    )
    if (ingredientIndex === -1) {
      throw new Error("Không tìm thấy hoạt chất")
    }

    // Check for duplicate ingredient name if it's being updated
    if (ingredientData.ingredient_name) {
      const existingIngredient = activeIngredients.find(
        (ingredient) =>
          ingredient.ingredient_id !== ingredientData.ingredient_id &&
          ingredient.ingredient_name.toLowerCase() === ingredientData.ingredient_name!.toLowerCase(),
      )

      if (existingIngredient) {
        throw new Error("Tên hoạt chất đã tồn tại")
      }
    }

    const currentIngredient = activeIngredients[ingredientIndex]
    const updatedIngredient: ActiveIngredient = {
      ...currentIngredient,
      ingredient_name: ingredientData.ingredient_name ?? currentIngredient.ingredient_name,
      description: ingredientData.description ?? currentIngredient.description,
      hazard_level: ingredientData.hazard_level ?? currentIngredient.hazard_level,
      chemical_formula: ingredientData.chemical_formula ?? currentIngredient.chemical_formula,
      cas_number: ingredientData.cas_number ?? currentIngredient.cas_number,
      is_active: ingredientData.is_active ?? currentIngredient.is_active,
      updated_at: new Date(),
    }

    activeIngredients[ingredientIndex] = updatedIngredient
    return updatedIngredient
  },

  async deleteActiveIngredient(ingredientId: string): Promise<boolean> {
    await delay(300)

    const ingredientIndex = activeIngredients.findIndex((ingredient) => ingredient.ingredient_id === ingredientId)
    if (ingredientIndex === -1) {
      throw new Error("Không tìm thấy hoạt chất")
    }

    activeIngredients.splice(ingredientIndex, 1)
    return true
  },

  async toggleActiveIngredientStatus(ingredientId: string): Promise<ActiveIngredient> {
    await delay(200)

    const ingredientIndex = activeIngredients.findIndex((ingredient) => ingredient.ingredient_id === ingredientId)
    if (ingredientIndex === -1) {
      throw new Error("Không tìm thấy hoạt chất")
    }

    activeIngredients[ingredientIndex].is_active = !activeIngredients[ingredientIndex].is_active
    activeIngredients[ingredientIndex].updated_at = new Date()

    return activeIngredients[ingredientIndex]
  },
}

export const productAPI = {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    await delay(300)

    const {
      search = "",
      status = "",
      category = "",
      distributor = "",
      price_min,
      price_max,
      page = 1,
      limit = 10,
    } = filters

    let filteredProducts = [...products]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.product_name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.distributor.full_name.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (status && status !== "all") {
      const isActive = status === "active"
      filteredProducts = filteredProducts.filter((product) => product.is_active === isActive)
    }

    // Apply category filter
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter((product) =>
        product.categories.some((cat) => cat.category_id === category),
      )
    }

    // Apply distributor filter
    if (distributor && distributor !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.distributor.user_id === distributor)
    }

    // Apply price range filter
    if (price_min !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.unit_product_price >= price_min)
    }
    if (price_max !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.unit_product_price <= price_max)
    }

    // Sort by creation date (newest first)
    filteredProducts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    // Calculate pagination
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
      data: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async getProductById(productId: string): Promise<Product | null> {
    await delay(200)
    return products.find((product) => product.product_id === productId) || null
  },

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    await delay(400)

    const distributor = users.find((user) => user.user_id === productData.distributor_id)
    if (!distributor) {
      throw new Error("Không tìm thấy nhà phân phối")
    }

    const productCategories = categories.filter((cat) => productData.category_ids.includes(cat.category_id))
    if (productCategories.length !== productData.category_ids.length) {
      throw new Error("Một số danh mục không tồn tại")
    }

    const newProduct: Product = {
      product_id: generateId(),
      distributor,
      categories: productCategories,
      product_name: productData.product_name,
      description: productData.description,
      usage_instructions: productData.usage_instructions,
      unit_product_price: productData.unit_product_price,
      is_active: productData.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
      product_images: [],
      product_ingredients: [],
      product_diseases: [],
    }

    products.unshift(newProduct)
    return newProduct
  },

  async updateProduct(productData: UpdateProductRequest): Promise<Product> {
    await delay(400)

    const productIndex = products.findIndex((product) => product.product_id === productData.product_id)
    if (productIndex === -1) {
      throw new Error("Không tìm thấy sản phẩm")
    }

    const currentProduct = products[productIndex]
    let updatedCategories = currentProduct.categories

    if (productData.category_ids) {
      updatedCategories = categories.filter((cat) => productData.category_ids!.includes(cat.category_id))
      if (updatedCategories.length !== productData.category_ids.length) {
        throw new Error("Một số danh mục không tồn tại")
      }
    }

    const updatedProduct: Product = {
      ...currentProduct,
      categories: updatedCategories,
      product_name: productData.product_name ?? currentProduct.product_name,
      description: productData.description ?? currentProduct.description,
      usage_instructions: productData.usage_instructions ?? currentProduct.usage_instructions,
      unit_product_price: productData.unit_product_price ?? currentProduct.unit_product_price,
      is_active: productData.is_active ?? currentProduct.is_active,
      updated_at: new Date(),
    }

    products[productIndex] = updatedProduct
    return updatedProduct
  },

  async deleteProduct(productId: string): Promise<boolean> {
    await delay(300)

    const productIndex = products.findIndex((product) => product.product_id === productId)
    if (productIndex === -1) {
      throw new Error("Không tìm thấy sản phẩm")
    }

    products.splice(productIndex, 1)
    return true
  },

  async toggleProductStatus(productId: string): Promise<Product> {
    await delay(200)

    const productIndex = products.findIndex((product) => product.product_id === productId)
    if (productIndex === -1) {
      throw new Error("Không tìm thấy sản phẩm")
    }

    products[productIndex].is_active = !products[productIndex].is_active
    products[productIndex].updated_at = new Date()

    return products[productIndex]
  },

  // Product-Ingredient relationships
  async addProductIngredient(data: ProductIngredientRequest): Promise<ProductIngredient> {
    await delay(300)

    const product = products.find((p) => p.product_id === data.product_id)
    const ingredient = activeIngredients.find((i) => i.ingredient_id === data.ingredient_id)

    if (!product) throw new Error("Không tìm thấy sản phẩm")
    if (!ingredient) throw new Error("Không tìm thấy hoạt chất")

    // Check if relationship already exists
    const existingRelation = productIngredients.find(
      (pi) => pi.product.product_id === data.product_id && pi.active_ingredient.ingredient_id === data.ingredient_id,
    )
    if (existingRelation) {
      throw new Error("Hoạt chất đã được thêm vào sản phẩm")
    }

    const newProductIngredient: ProductIngredient = {
      product_ingredient_id: generateId(),
      product,
      active_ingredient: ingredient,
      concentration: data.concentration,
      is_primary: data.is_primary,
      created_at: new Date(),
    }

    productIngredients.push(newProductIngredient)

    // Update product's ingredients array
    if (!product.product_ingredients) product.product_ingredients = []
    product.product_ingredients.push(newProductIngredient)

    return newProductIngredient
  },

  async updateProductIngredient(
    productIngredientId: string,
    data: Partial<ProductIngredientRequest>,
  ): Promise<ProductIngredient> {
    await delay(300)

    const piIndex = productIngredients.findIndex((pi) => pi.product_ingredient_id === productIngredientId)
    if (piIndex === -1) {
      throw new Error("Không tìm thấy mối quan hệ sản phẩm-hoạt chất")
    }

    const currentPI = productIngredients[piIndex]
    const updatedPI: ProductIngredient = {
      ...currentPI,
      concentration: data.concentration ?? currentPI.concentration,
      is_primary: data.is_primary ?? currentPI.is_primary,
    }

    productIngredients[piIndex] = updatedPI
    return updatedPI
  },

  async removeProductIngredient(productIngredientId: string): Promise<boolean> {
    await delay(300)

    const piIndex = productIngredients.findIndex((pi) => pi.product_ingredient_id === productIngredientId)
    if (piIndex === -1) {
      throw new Error("Không tìm thấy mối quan hệ sản phẩm-hoạt chất")
    }

    const removedPI = productIngredients[piIndex]
    productIngredients.splice(piIndex, 1)

    // Update product's ingredients array
    const product = products.find((p) => p.product_id === removedPI.product.product_id)
    if (product && product.product_ingredients) {
      product.product_ingredients = product.product_ingredients.filter(
        (pi) => pi.product_ingredient_id !== productIngredientId,
      )
    }

    return true
  },

  // Product-Disease relationships
  async addProductDisease(data: ProductDiseaseRequest): Promise<ProductDisease> {
    await delay(300)

    const product = products.find((p) => p.product_id === data.product_id)
    const disease = diseases.find((d) => d.disease_id === data.disease_id)

    if (!product) throw new Error("Không tìm thấy sản phẩm")
    if (!disease) throw new Error("Không tìm thấy bệnh")

    // Check if relationship already exists
    const existingRelation = productDiseases.find(
      (pd) => pd.product.product_id === data.product_id && pd.disease.disease_id === data.disease_id,
    )
    if (existingRelation) {
      throw new Error("Bệnh đã được thêm vào sản phẩm")
    }

    const newProductDisease: ProductDisease = {
      product_disease_id: generateId(),
      product,
      disease,
      is_primary: data.is_primary,
      created_at: new Date(),
    }

    productDiseases.push(newProductDisease)

    // Update product's diseases array
    if (!product.product_diseases) product.product_diseases = []
    product.product_diseases.push(newProductDisease)

    return newProductDisease
  },

  async updateProductDisease(productDiseaseId: string, data: Partial<ProductDiseaseRequest>): Promise<ProductDisease> {
    await delay(300)

    const pdIndex = productDiseases.findIndex((pd) => pd.product_disease_id === productDiseaseId)
    if (pdIndex === -1) {
      throw new Error("Không tìm thấy mối quan hệ sản phẩm-bệnh")
    }

    const currentPD = productDiseases[pdIndex]
    const updatedPD: ProductDisease = {
      ...currentPD,
      is_primary: data.is_primary ?? currentPD.is_primary,
    }

    productDiseases[pdIndex] = updatedPD
    return updatedPD
  },

  async removeProductDisease(productDiseaseId: string): Promise<boolean> {
    await delay(300)

    const pdIndex = productDiseases.findIndex((pd) => pd.product_disease_id === productDiseaseId)
    if (pdIndex === -1) {
      throw new Error("Không tìm thấy mối quan hệ sản phẩm-bệnh")
    }

    const removedPD = productDiseases[pdIndex]
    productDiseases.splice(pdIndex, 1)

    // Update product's diseases array
    const product = products.find((p) => p.product_id === removedPD.product.product_id)
    if (product && product.product_diseases) {
      product.product_diseases = product.product_diseases.filter((pd) => pd.product_disease_id !== productDiseaseId)
    }

    return true
  },

  // Product images
  async addProductImage(
    productId: string,
    imageUrl: string,
    isPrimary = false,
    altText?: string,
  ): Promise<ProductImage> {
    await delay(300)

    const product = products.find((p) => p.product_id === productId)
    if (!product) throw new Error("Không tìm thấy sản phẩm")

    const newProductImage: ProductImage = {
      image_id: generateId(),
      product,
      image_url: imageUrl,
      is_primary: isPrimary,
      alt_text: altText,
      created_at: new Date(),
    }

    productImages.push(newProductImage)

    // Update product's images array
    if (!product.product_images) product.product_images = []
    product.product_images.push(newProductImage)

    return newProductImage
  },

  async updateProductImage(
    imageId: string,
    imageUrl?: string,
    isPrimary?: boolean,
    altText?: string,
  ): Promise<ProductImage> {
    await delay(300)

    const imageIndex = productImages.findIndex((img) => img.image_id === imageId)
    if (imageIndex === -1) {
      throw new Error("Không tìm thấy hình ảnh")
    }

    const currentImage = productImages[imageIndex]
    const updatedImage: ProductImage = {
      ...currentImage,
      image_url: imageUrl ?? currentImage.image_url,
      is_primary: isPrimary ?? currentImage.is_primary,
      alt_text: altText ?? currentImage.alt_text,
    }

    productImages[imageIndex] = updatedImage
    return updatedImage
  },

  async removeProductImage(imageId: string): Promise<boolean> {
    await delay(300)

    const imageIndex = productImages.findIndex((img) => img.image_id === imageId)
    if (imageIndex === -1) {
      throw new Error("Không tìm thấy hình ảnh")
    }

    const removedImage = productImages[imageIndex]
    productImages.splice(imageIndex, 1)

    // Update product's images array
    const product = products.find((p) => p.product_id === removedImage.product.product_id)
    if (product && product.product_images) {
      product.product_images = product.product_images.filter((img) => img.image_id !== imageId)
    }

    return true
  },
}

export const storeRequestAPI = {
  async getStoreRequests(filters: StoreRequestFilters = {}): Promise<PaginatedResponse<StoreOwnerRequest>> {
    await delay(300)

    const { search = "", status = "", page = 1, limit = 10 } = filters

    let filteredRequests = [...storeRequests]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredRequests = filteredRequests.filter(
        (request) =>
          request.user.full_name.toLowerCase().includes(searchLower) ||
          request.name.toLowerCase().includes(searchLower) ||
          request.business_license.includes(search) ||
          request.user.email.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (status && status !== "all") {
      if (status === "pending") {
        filteredRequests = filteredRequests.filter((request) => !request.request_status && !request.approved_date)
      } else if (status === "approved") {
        filteredRequests = filteredRequests.filter((request) => request.request_status && request.approved_date)
      } else if (status === "rejected") {
        filteredRequests = filteredRequests.filter((request) => !request.request_status && request.approved_date)
      }
    }

    // Sort by request date (newest first)
    filteredRequests.sort((a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime())

    // Calculate pagination
    const total = filteredRequests.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex)

    return {
      data: paginatedRequests,
      total,
      page,
      limit,
      totalPages,
    }
  },

  async approveStoreRequest(requestId: string): Promise<StoreOwnerRequest> {
    await delay(400)

    const requestIndex = storeRequests.findIndex((req) => req.store_owner_request_id === requestId)
    if (requestIndex === -1) {
      throw new Error("Không tìm thấy yêu cầu")
    }

    const request = storeRequests[requestIndex]
    if (request.approved_date) {
      throw new Error("Yêu cầu đã được xử lý")
    }

    // Update request status
    storeRequests[requestIndex] = {
      ...request,
      request_status: true,
      approved_date: new Date().toISOString(),
    }

    // Update user role to DISTRIBUTOR
    const userIndex = users.findIndex((user) => user.user_id === request.user.user_id)
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        role: {
          role_id: "2",
          role_name: "DISTRIBUTOR",
          description: "Nhà phân phối",
          is_active: true,
        },
        updated_at: new Date(),
      }

      // Create warehouse for the approved distributor
      const newWarehouse: Invenstory = {
        invenstory_id: generateId(),
        distributor: users[userIndex],
        name: request.name,
        business_license: request.business_license,
        invenstory_address: request.invenstory_address,
        invenstory_lat: request.invenstory_lat,
        invenstory_lng: request.invenstory_lng,
        invenstory_img: request.invenstory_img,
        is_locked: false,
        created_at: new Date(),
        updated_at: new Date(),
      }

      warehouses.push(newWarehouse)
    }

    return storeRequests[requestIndex]
  },

  async rejectStoreRequest(requestId: string, reason: string): Promise<StoreOwnerRequest> {
    await delay(400)

    const requestIndex = storeRequests.findIndex((req) => req.store_owner_request_id === requestId)
    if (requestIndex === -1) {
      throw new Error("Không tìm thấy yêu cầu")
    }

    const request = storeRequests[requestIndex]
    if (request.approved_date) {
      throw new Error("Yêu cầu đã được xử lý")
    }

    // Update request status
    storeRequests[requestIndex] = {
      ...request,
      request_status: false,
      approved_date: new Date().toISOString(),
      // Store rejection reason in a custom field (extend interface if needed)
    }

    return storeRequests[requestIndex]
  },
}
