import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  sellerId: string
  sellerName: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

