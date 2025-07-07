import { atom } from "jotai"
import type { User } from "@/types/entities"

export const currentUserAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom((get) => get(currentUserAtom) !== null)
export const userRoleAtom = atom((get) => get(currentUserAtom)?.role.role_name)

// Mock authentication functions
export const mockUsers: User[] = [
  {
    user_id: "1",
    username: "admin",
    email: "admin@farme.com",
    full_name: "System Administrator",
    phone_number: "+84123456789",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    role: {
      role_id: "1",
      role_name: "ADMIN",
      description: "System Administrator",
      is_active: true,
    },
  },
  {
    user_id: "2",
    username: "distributor1",
    email: "distributor@farme.com",
    full_name: "Green Valley Pesticides",
    phone_number: "+84987654321",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    role: {
      role_id: "2",
      role_name: "DISTRIBUTOR",
      description: "Product Distributor",
      is_active: true,
    },
  },
]

export const authenticateUser = (username: string, password: string): User | null => {
  // Mock authentication - in real app, this would call your API
  const user = mockUsers.find((u) => u.username === username)
  return user || null
}
