import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart-slice";
import userReducer from "./features/user-slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.ts này chứa cấu hình của Redux store, bao gồm các reducer và các type RootState và AppDispatch. Các reducer được import từ các file features/cart-slice.ts và features/user-slice.ts. Các type RootState và AppDispatch được tạo ra từ store bằng cách sử dụng ReturnType<typeof store.getState> và typeof store.dispatch.
// Các reducer được sử dụng để xử lý các action và cập nhật state trong Redux store. Các type RootState và AppDispatch được sử dụng để định nghĩa kiểu dữ liệu của state và dispatch trong ứng dụng.
