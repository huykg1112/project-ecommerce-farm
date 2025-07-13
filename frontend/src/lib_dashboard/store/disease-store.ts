// frontend/src/lib_dashboard/store/disease-store.ts

import { atom } from "jotai";
import {
  DiseaseFilters,
  DiseaseFormData,
  DiseaseTableData,
} from "../types/disease";

// Filter state
export const diseaseFiltersAtom = atom<DiseaseFilters>({
  search: "",
  status: "",
});
// Diseases data state
export const diseasesDataAtom = atom<DiseaseTableData[]>([]);

// Loading state
export const diseasesLoadingAtom = atom<boolean>(false);

// Pagination state
export const diseasesPaginationAtom = atom({
  total: 0,
  totalPages: 0,
});

// Selected diseases for batch actions
export const selectedDiseasesAtom = atom<string[]>([]);

// Derived state for select all checkbox
export const isAllDiseasesSelectedAtom = atom((get) => {
  const diseases = get(diseasesDataAtom);
  const selectedDiseases = get(selectedDiseasesAtom);
  return diseases.length > 0 && selectedDiseases.length === diseases.length;
});

// Derived state for indeterminate checkbox
export const isActiveDiseasesIndeterminateAtom = atom((get) => {
  const diseases = get(diseasesDataAtom);
  const selectedDiseases = get(selectedDiseasesAtom);
  return (
    selectedDiseases.length > 0 && selectedDiseases.length < diseases.length
  );
});

// Form state for add/edit disease
export const activeDiseasesFormDataAtom = atom<DiseaseFormData>({
  disease_name: "",
  description: "",
  is_active: true,
});

// Modal states
export const addActiveIngredientModalAtom = atom<boolean>(false);
export const editActiveIngredientModalAtom = atom<boolean>(false);
export const deleteActiveIngredientModalAtom = atom<boolean>(false);
export const selectedActiveIngredientIdAtom = atom<string>("");

// Reset form data
export const resetFormAtom = atom(null, (get, set) => {
  set(activeDiseasesFormDataAtom, {
    disease_name: "",
    description: "",
    is_active: true,
  });
});
