"use client"

import { useEffect } from "react"
import { useProductStore } from "@/lib/store/product-store"
import { productService } from "@/lib/services/product-service"
import { categoryService } from "@/lib/services/category-service"
import { diseaseService } from "@/lib/services/disease-service"
import { activeIngredientService } from "@/lib/services/active-ingredient-service"
import type { CreateProductRequest, UpdateProductRequest } from "@/lib/mock/server"

export function useProducts() {
  const store = useProductStore()

  const fetchProducts = async () => {
    try {
      store.setLoading(true)
      store.setError(null)

      const response = await productService.getProducts({
        ...store.filters,
        page: store.currentPage,
        limit: store.itemsPerPage,
      })

      store.setProducts(response.data)
      store.setPagination(response.page, response.totalPages, response.total)
    } catch (error) {
      store.setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      store.setLoading(false)
    }
  }

  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, diseasesRes, ingredientsRes] = await Promise.all([
        categoryService.getCategories({ limit: 100 }),
        diseaseService.getDiseases({ limit: 100 }),
        activeIngredientService.getActiveIngredients({ limit: 100 }),
      ])

      store.setCategories(categoriesRes.data.filter((c) => c.is_active))
      store.setDiseases(diseasesRes.data.filter((d) => d.is_active))
      store.setActiveIngredients(ingredientsRes.data.filter((i) => i.is_active))
    } catch (error) {
      console.error("Failed to fetch reference data:", error)
    }
  }

  const createProduct = async (productData: CreateProductRequest) => {
    try {
      store.setLoading(true)
      await productService.createProduct(productData)
      await fetchProducts()
      store.closeModals()
    } catch (error) {
      store.setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const updateProduct = async (productData: UpdateProductRequest) => {
    try {
      store.setLoading(true)
      await productService.updateProduct(productData)
      await fetchProducts()
      store.closeModals()
    } catch (error) {
      store.setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: string, reason?: string) => {
    try {
      store.setLoading(true)
      await productService.toggleProductStatus(productId)
      await fetchProducts()
      store.closeModals()
    } catch (error) {
      store.setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      store.setLoading(true)
      await productService.deleteProduct(productId)
      await fetchProducts()
    } catch (error) {
      store.setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
      throw error
    } finally {
      store.setLoading(false)
    }
  }

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    fetchProducts()
  }, [store.filters, store.currentPage])

  // Fetch reference data on mount
  useEffect(() => {
    fetchReferenceData()
  }, [])

  return {
    ...store,
    fetchProducts,
    createProduct,
    updateProduct,
    toggleProductStatus,
    deleteProduct,
  }
}
