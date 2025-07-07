import { activeIngredientService } from "@/lib_dashboard/services/active-ingredient-service";
import {
  ActiveIngredientFormData,
  activeIngredientsDataAtom,
  activeIngredientsFiltersAtom,
  activeIngredientsFormDataAtom,
  activeIngredientsLoadingAtom,
  addActiveIngredientModalAtom,
  deleteActiveIngredientModalAtom,
  editActiveIngredientModalAtom,
  resetActiveIngredientFormAtom,
  selectedActiveIngredientIdAtom,
} from "@/lib_dashboard/store/active-ingredient-store";
import { useAtom } from "jotai";

export function useIngredient() {
  const [filters, setFilters] = useAtom(activeIngredientsFiltersAtom);
  const [, setActiveIngredients] = useAtom(activeIngredientsDataAtom);
  const [, setLoading] = useAtom(activeIngredientsLoadingAtom);
  const [, resetForm] = useAtom(resetActiveIngredientFormAtom);

  const [, setAddOpen] = useAtom(addActiveIngredientModalAtom);
  const [, setEditOpen] = useAtom(editActiveIngredientModalAtom);
  const [, setDeleteOpen] = useAtom(deleteActiveIngredientModalAtom);
  const [, setSelectedId] = useAtom(selectedActiveIngredientIdAtom);
  const [, setFormData] = useAtom(activeIngredientsFormDataAtom);

  async function fetchList() {
    setLoading(true);
    const list = await activeIngredientService.list(filters);
    setActiveIngredients(list);
    setLoading(false);
  }

  async function addIngredient(data: ActiveIngredientFormData) {
    await activeIngredientService.create(data);
    await fetchList();
  }

  async function editIngredient(id: string, data: ActiveIngredientFormData) {
    await activeIngredientService.update(id, data);
    await fetchList();
  }

  async function deleteIngredient(id: string) {
    await activeIngredientService.remove(id);
    await fetchList();
  }

  async function toggleStatus(id: string) {
    await activeIngredientService.toggle(id);
    await fetchList();
  }

  /* ----- helpers for opening / closing modals ----- */
  function openAddModal() {
    resetForm();
    setAddOpen(true);
  }

  function closeAddModal() {
    setAddOpen(false);
  }

  function openEditModal(id: string, data: ActiveIngredientFormData) {
    setSelectedId(id);
    setFormData(data);
    setEditOpen(true);
  }

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setDeleteOpen(true);
  }

  return {
    filters,
    setFilters,
    fetchList,
    addIngredient,
    editIngredient,
    deleteIngredient,
    toggleStatus,
    openAddModal,
    closeAddModal,
    openEditModal,
    openDeleteModal,
  };
}
