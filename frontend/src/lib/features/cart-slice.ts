import { BatchProduct } from "@/lib_dashboard/types/batch-product";
import { Promotion } from "@/lib_dashboard/types/promotion";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
//createSlice là một hàm của Redux Toolkit để tạo ra một slice (một phần của Redux store) với các reducer và action creators tự động
//PayloadAction là một kiểu dữ liệu của Redux Toolkit để định nghĩa action với payload

export interface CartItem {
  id: string;
  productId: string; // ID của sản phẩm
  name: string;
  price: number;
  valueDiscount?: number; // Optional value for discount
  quantity: number; // Số lượng sản phẩm trong giỏ hàng
  image: string;
  sellerId: string;
  sellerName: string;
  promotion: Promotion | null; // Optional promotion
  batch: BatchProduct | null; // Optional batch
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Initialize state from localStorage if available
const getInitialState = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [], totalItems: 0, totalAmount: 0 };
  }

  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart) as CartState;
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
  }

  return { items: [], totalItems: 0, totalAmount: 0 };
};

const initialState: CartState = getInitialState();

const calculateTotals = (state: CartState) => {
  state.totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  state.totalAmount = state.items.reduce((total, item) => {
    const originalPrice = item.price;
    const discountValue = item.promotion?.discount_value || 0;
    const finalPrice = originalPrice - discountValue;
    return total + finalPrice * item.quantity;
  }, 0);

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      //PayloadAction là một kiểu dữ liệu của Redux Toolkit để định nghĩa action với payload
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.batch?.batch_id === action.payload.batch?.batch_id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      calculateTotals(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      calculateTotals(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotalItems = (state: { cart: CartState }) =>
  state.cart.totalItems;
export const selectCartTotalAmount = (state: { cart: CartState }) =>
  state.cart.totalAmount;

export default cartSlice.reducer;

// Các hàm addToCart, removeFromCart, updateQuantity, clearCart được export ra để sử dụng trong các component khác
// Đây là slice của Redux store để quản lý giỏ hàng của người dùng
//cartSlice.reducer là reducer của slice này, được sử dụng để xử lý các action và cập nhật state trong Redux store
