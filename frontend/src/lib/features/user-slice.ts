import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  role: "buyer" | "seller" | "admin"
}

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
      }
    },
  },
})

export const { setUser, clearUser, setLoading, updateUserProfile } = userSlice.actions
export default userSlice.reducer

