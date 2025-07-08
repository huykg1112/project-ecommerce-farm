import type { User } from "@/types/entities";
import { atom } from "jotai";

// Filter state (chỉ dùng cho FE)
export interface UserFilters {
  search: string;
  role: string;
  status: string;
  page: number;
  limit: number;
}

export const userFiltersAtom = atom<UserFilters>({
  search: "",
  role: "",
  status: "",
  page: 1,
  limit: 10,
});

// Selected users state
export const selectedUsersAtom = atom<string[]>([]);

// All users data state (lấy hết từ BE)
export const allUsersDataAtom = atom<User[]>([]);

// Loading state
export const usersLoadingAtom = atom<boolean>(false);

// Form state for add/edit user
export interface UserFormData {
  user_id?: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  role_name: string;
  cccd?: string;
  password?: string;
  is_active?: boolean;
}

export const userFormDataAtom = atom<UserFormData>({
  user_id: "",
  username: "",
  email: "",
  full_name: "",
  phone_number: "",
  role_name: "",
  cccd: "",
  password: "",
  is_active: true,
});

// Modal states
export const addUserModalAtom = atom<boolean>(false);
export const editUserModalAtom = atom<boolean>(false);
export const deleteUserModalAtom = atom<boolean>(false);
export const selectedUserIdAtom = atom<string>("");

// Derived atoms for selection UI
export const isAllSelectedAtom = atom((get) => {
  // This atom may need to be updated in UI to use the new paginated users from useUsers
  return false;
});

export const isIndeterminateAtom = atom((get) => {
  // This atom may need to be updated in UI to use the new paginated users from useUsers
  return false;
});

// Reset form data
export const resetUserFormAtom = atom(null, (get, set) => {
  set(userFormDataAtom, {
    username: "",
    email: "",
    full_name: "",
    phone_number: "",
    role_name: "",
    cccd: "",
    password: "",
    is_active: true,
  });
});
