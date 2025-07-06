import { mockCategoriesData } from "@/lib/mock/categories"
import type { Category } from "@/types/entities"
import type { CategoryFilters, CategoryFormData } from "@/lib/store/category-store"

/**
 * A tiny in-memory service that mimics CRUD behaviour.
 * In a real project you would replace this with real API calls.
 */
class CategoryService {
  private data: Category[] = [...mockCategoriesData]

  async list(filters: CategoryFilters) {
    const { search = "", status = "" } = filters
    let result = [...this.data]

    if (search) {
      const keyword = search.toLowerCase()
      result = result.filter((c) => c.category_name.toLowerCase().includes(keyword))
    }

    if (status === "active") result = result.filter((c) => c.is_active)
    if (status === "inactive") result = result.filter((c) => !c.is_active)

    return result
  }

  async create(payload: CategoryFormData) {
    const newCat: Category = {
      category_id: crypto.randomUUID(),
      category_name: payload.category_name,
      description: payload.description,
      category_img: payload.category_img,
      is_active: true,
    }
    this.data.unshift(newCat)
    return newCat
  }

  async update(id: string, payload: CategoryFormData) {
    this.data = this.data.map((c) => (c.category_id === id ? { ...c, ...payload, category_id: id } : c))
  }

  async remove(id: string) {
    this.data = this.data.filter((c) => c.category_id !== id)
  }

  async toggle(id: string) {
    this.data = this.data.map((c) => (c.category_id === id ? { ...c, is_active: !c.is_active } : c))
  }
}

export const categoryService = new CategoryService()
