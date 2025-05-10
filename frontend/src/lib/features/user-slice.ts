import {
    LoginRequest,
    RegisterRequest,
    UpdateProfileDto,
    UserProfile,
} from "@/interfaces";
import {
    createAsyncThunk, // Hàm tạo async thunks, đây là một hàm của Redux Toolkit giúp tạo ra các async thunks, dùng để xử lý các side effects như gọi API, xử lý bất đồng bộ, ...
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { authService } from "../services/auth-service";
import { userService } from "../services/user-service";

export interface User {
  id?: string;
  username: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  roleName?: string;
  fullName?: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | string[] | null;
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
}

// Kiểm tra xem đang ở phía client hay server
const isClient = typeof window !== "undefined";

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: isClient ? authService.isAuthenticated() : false,
  loading: false,
  error: null,
  profile: null,
  profileLoading: false,
  profileError: null,
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
    // _là tham số không sử dụng
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

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // check refresh token
      if (isClient && authService.isTokenExpired()) {
        await authService.refreshToken();
      }
      const profile = await userService.getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Không thể tải thông tin người dùng"
      );
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData: UpdateProfileDto, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData);
      // Sau khi cập nhật thành công, lấy lại thông tin profile mới
      const updatedProfile = await userService.getProfile();
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.message || "Cập nhật thông tin thất bại");
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
      state.profile = null;
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
    //   extraReducers: (builder) là một phần của Redux Toolkit, cho phép bạn xử lý các action ngoài các action được định nghĩa trong slice. Nó cho phép bạn thêm các case cho các action được tạo ra từ createAsyncThunk hoặc các action khác mà không cần phải định nghĩa chúng trong reducers.
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Nếu đăng nhập thành công, lưu thông tin người dùng vào state
      // action.payload là thông tin người dùng từ server
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      // Nếu đăng nhập thất bại, lưu thông báo lỗi vào state
      // action.payload là thông báo lỗi từ server
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | string[];
      })
      // Register
      // Nếu đăng ký thành công, không cần làm gì thêm
      // action.payload là thông tin người dùng từ server
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // action.payload là thông tin người dùng từ server
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Không đăng nhập tự động sau khi đăng ký
      })
      // Nếu đăng ký thất bại, lưu thông báo lỗi vào state
      // action.payload là thông báo lỗi từ server
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | string[];
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      // nêu đăng xuất thành công, xóa thông tin người dùng khỏi state
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      // Nếu đăng xuất thất bại, lưu thông báo lỗi vào state
      // action.payload là thông báo lỗi từ server
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
          localStorage.removeItem("Authorization");
          localStorage.removeItem("wishlist");
        }
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        // Cập nhật currentUser với thông tin từ profile
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            id: action.payload.id,
            email: action.payload.email,
            phone: action.payload.phone,
            address: action.payload.address,
            avatar: action.payload.avatar,
            roleName: action.payload.roleName,
            fullName: action.payload.fullName,
          };
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        // Cập nhật currentUser với thông tin từ profile
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            email: action.payload.email,
            phone: action.payload.phone,
            address: action.payload.address,
            fullName: action.payload.fullName,
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      });
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  updateUserProfile: updateUserProfileAction,
  clearError,
} = userSlice.actions;
export default userSlice.reducer;
// user-slice.ts này chứa slice của user trong Redux store, bao gồm các reducers và các async thunks để xử lý các action liên quan đến user như đăng nhập, đăng ký, đăng xuất, làm mới token, cập nhật thông tin user. Các reducers và
// async thunks này được sử dụng trong các components và services khác trong ứng dụng để thực hiện các tác vụ liên quan đến user.
