import type { RootState } from "@/lib/features/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sellerId: string;
  sellerName: string;
  category: string;
  discount?: number;
}

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
}

// Initialize state from localStorage if available
const getInitialState = (): WishlistState => {
  if (typeof window === "undefined") {
    return { items: [], totalItems: 0 };
  }

  try {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const parsed = JSON.parse(savedWishlist) as WishlistState;
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse wishlist from localStorage:", error);
  }

  return { items: [], totalItems: 0 };
};

const initialState: WishlistState = getInitialState();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!existingItem) {
        state.items.push(action.payload);
        state.totalItems = state.items.length;

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("wishlist", JSON.stringify(state));
        }
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalItems = state.items.length;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state));
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state));
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistTotalItems = (state: RootState) =>
  state.wishlist.totalItems;
export const selectIsInWishlist = (id: string) => (state: RootState) =>
  state.wishlist.items.some((item) => item.id === id);

export default wishlistSlice.reducer;
