import type { ActiveIngredient, Product } from "@/types/entities";
import { create } from "zustand";
import { DiseaseFilters as Disease } from "../services/disease-service";
import { Category } from "../types/category";

export interface ProductFilters {
  search: string;
  status: string;
  category: string;
  distributor: string;
  price_min?: number;
  price_max?: number;
}

export interface ProductStore {
  // Products
  products: Product[];
  loading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;

  // Filters
  filters: ProductFilters;

  // Selection
  selectedProducts: string[];

  // Modal states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isLockModalOpen: boolean;
  editingProduct: Product | null;
  lockingProduct: Product | null;

  // Reference data
  categories: Category[];
  diseases: Disease[];
  activeIngredients: ActiveIngredient[];

  // Actions
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, totalPages: number, totalItems: number) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setSelectedProducts: (productIds: string[]) => void;
  toggleProductSelection: (productId: string) => void;
  selectAllProducts: () => void;
  clearSelection: () => void;

  // Modal actions
  openAddModal: () => void;
  openEditModal: (product: Product) => void;
  openLockModal: (product: Product) => void;
  closeModals: () => void;

  // Reference data actions
  setCategories: (categories: Category[]) => void;
  setDiseases: (diseases: Disease[]) => void;
  setActiveIngredients: (ingredients: ActiveIngredient[]) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  loading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,

  filters: {
    search: "",
    status: "all",
    category: "all",
    distributor: "all",
  },

  selectedProducts: [],

  isAddModalOpen: false,
  isEditModalOpen: false,
  isLockModalOpen: false,
  editingProduct: null,
  lockingProduct: null,

  categories: [],
  diseases: [],
  activeIngredients: [],

  // Actions
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (page, totalPages, totalItems) =>
    set({ currentPage: page, totalPages, totalItems }),
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setSelectedProducts: (productIds) => set({ selectedProducts: productIds }),
  toggleProductSelection: (productId) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.includes(productId)
        ? state.selectedProducts.filter((id) => id !== productId)
        : [...state.selectedProducts, productId],
    })),
  selectAllProducts: () =>
    set((state) => ({
      selectedProducts: state.products.map((p) => p.product_id),
    })),
  clearSelection: () => set({ selectedProducts: [] }),

  // Modal actions
  openAddModal: () => set({ isAddModalOpen: true }),
  openEditModal: (product) =>
    set({ isEditModalOpen: true, editingProduct: product }),
  openLockModal: (product) =>
    set({ isLockModalOpen: true, lockingProduct: product }),
  closeModals: () =>
    set({
      isAddModalOpen: false,
      isEditModalOpen: false,
      isLockModalOpen: false,
      editingProduct: null,
      lockingProduct: null,
    }),

  // Reference data actions
  setCategories: (categories) => set({ categories }),
  setDiseases: (diseases) => set({ diseases }),
  setActiveIngredients: (activeIngredients) => set({ activeIngredients }),
}));
