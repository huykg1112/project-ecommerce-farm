import {
  createAsyncThunk, // Hàm tạo async thunks, đây là một hàm của Redux Toolkit giúp tạo ra các async thunks, dùng để xử lý các side effects như gọi API, xử lý bất đồng bộ, ...
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  authService,
  type LoginRequest,
  type RegisterRequest,
} from "../services/auth-service";

export interface User {
  id?: string;
  username: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: "buyer" | "seller" | "admin";
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | string[] | null;
}

// Kiểm tra xem đang ở phía client hay server
const isClient = typeof window !== "undefined";

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: isClient ? authService.isAuthenticated() : false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // console.log(localStorage.getItem("access_token"));
      // Giả định rằng chúng ta chỉ có username từ response
      return { username: credentials.username } as User;
    } catch (error: any) {
      // Trả về message từ server
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      // Trả về message từ server
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      // console.log("Logout message");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng xuất thất bại");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Làm mới token thất bại");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | string[];
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Không đăng nhập tự động sau khi đăng ký
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | string[];
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | string[];
        // Vẫn đăng xuất người dùng ngay cả khi API gọi thất bại
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state) => {
        // Token đã được cập nhật trong localStorage bởi authService
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        // Nếu refresh token thất bại, đăng xuất người dùng
        state.currentUser = null;
        state.isAuthenticated = false;
        if (isClient) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      });
  },
});

export const { setUser, clearUser, setLoading, updateUserProfile, clearError } =
  userSlice.actions;
export default userSlice.reducer;
// user-slice.ts này chứa slice của user trong Redux store, bao gồm các reducers và các async thunks để xử lý các action liên quan đến user như đăng nhập, đăng ký, đăng xuất, làm mới token, cập nhật thông tin user. Các reducers và
// async thunks này được sử dụng trong các components và services khác trong ứng dụng để thực hiện các tác vụ liên quan đến user.
