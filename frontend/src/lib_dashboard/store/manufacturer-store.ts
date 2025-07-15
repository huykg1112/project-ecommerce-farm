import { atom } from "jotai";
import { Manufacturer } from "../types/manufacturer";

export interface ManufacturerFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ManufacturerFormData {
  id?: string;
  name: string;
  description: string;
  logo?: string;
  isActive: boolean;
}

// Filter state
export const manufacturerFiltersAtom = atom<ManufacturerFilters>({
  search: "",
  status: "",
  page: 1,
  limit: 10,
});

// Manufacturers data state
export const manufacturersDataAtom = atom<Manufacturer[]>([]);

// Loading state
export const manufacturersLoadingAtom = atom<boolean>(false);

// Pagination state
export const manufacturersPaginationAtom = atom({
  total: 0,
  totalPages: 0,
});

// Selected manufacturers for batch actions
export const selectedManufacturersAtom = atom<string[]>([]);

// Derived state for select all checkbox
export const isAllSelectedAtom = atom((get) => {
  const manufacturers = get(manufacturersDataAtom);
  const selectedManufacturers = get(selectedManufacturersAtom);
  return (
    manufacturers.length > 0 &&
    selectedManufacturers.length === manufacturers.length
  );
});

// Derived state for indeterminate checkbox
export const isIndeterminateAtom = atom((get) => {
  const manufacturers = get(manufacturersDataAtom);
  const selectedManufacturers = get(selectedManufacturersAtom);
  return (
    selectedManufacturers.length > 0 &&
    selectedManufacturers.length < manufacturers.length
  );
});

// Form state for add/edit manufacturer
export const manufacturerFormDataAtom = atom<ManufacturerFormData>({
  name: "",
  description: "",
  logo: "",
  isActive: true,
});

// Modal states
export const addManufacturerModalAtom = atom<boolean>(false);
export const editManufacturerModalAtom = atom<boolean>(false);
export const deleteManufacturerModalAtom = atom<boolean>(false);
export const selectedManufacturerIdAtom = atom<string>("");

// Reset form data
export const resetManufacturerFormAtom = atom(null, (get, set) => {
  set(manufacturerFormDataAtom, {
    name: "",
    description: "",
    logo: "",
    isActive: true,
  });
});
