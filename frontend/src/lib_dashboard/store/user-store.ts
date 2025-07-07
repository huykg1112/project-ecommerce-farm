import type { User } from "@/types/entities";
import { atom } from "jotai";
import { UserFilters } from "../mock/server";

// Filter state
export const userFiltersAtom = atom<UserFilters>({
  search: "",
  role: "",
  status: "",
  page: 1,
  limit: 10,
});

// Selected users state
export const selectedUsersAtom = atom<string[]>([]);

// Users data state
export const usersDataAtom = atom<User[]>([]);

// Loading state
export const usersLoadingAtom = atom<boolean>(false);

// Pagination state
export const usersPaginationAtom = atom({
  total: 0,
  totalPages: 0,
});

// Form state for add/edit user
export interface UserFormData {
  user_id?: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  role_name: "ADMIN" | "DISTRIBUTOR" | "CUSTOMER";
  cccd?: string;
  password?: string;
  is_active?: boolean;
}

export const userFormDataAtom = atom<UserFormData>({
  username: "",
  email: "",
  full_name: "",
  phone_number: "",
  role_name: "CUSTOMER",
  cccd: "",
  password: "",
  is_active: true,
});

// Modal states
export const addUserModalAtom = atom<boolean>(false);
export const editUserModalAtom = atom<boolean>(false);
export const deleteUserModalAtom = atom<boolean>(false);
export const selectedUserIdAtom = atom<string>("");

// Derived atoms
export const isAllSelectedAtom = atom((get) => {
  const users = get(usersDataAtom);
  const selected = get(selectedUsersAtom);
  return users.length > 0 && selected.length === users.length;
});

export const isIndeterminateAtom = atom((get) => {
  const users = get(usersDataAtom);
  const selected = get(selectedUsersAtom);
  return selected.length > 0 && selected.length < users.length;
});

// Reset form data
export const resetUserFormAtom = atom(null, (get, set) => {
  set(userFormDataAtom, {
    username: "",
    email: "",
    full_name: "",
    phone_number: "",
    role_name: "CUSTOMER",
    cccd: "",
    password: "",
    is_active: true,
  });
});
