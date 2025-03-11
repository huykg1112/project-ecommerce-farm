import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./features/cart-slice"
import userReducer from "./features/user-slice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

