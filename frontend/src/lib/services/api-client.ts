import { store } from "../features/store";
import { logoutUser, refreshToken } from "../features/user-slice";
import { authService } from "./auth-service";

const API_URL = "http://localhost:4200";
const isClient = typeof window !== "undefined";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiClient = {
  async fetch(endpoint: string, options: FetchOptions = {}): Promise<any> {
    // Nếu đang ở phía server và yêu cầu xác thực, trả về lỗi
    if (!isClient && options.requireAuth) {
      throw new Error("Cannot make authenticated requests on server side");
    }

    const { requireAuth = false, ...fetchOptions } = options;

    // Nếu yêu cầu xác thực, thêm token vào header
    if (requireAuth) {
      const token = authService.getToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

      // Nếu token hết hạn (401), thử refresh token
      if (response.status === 401 && requireAuth && isClient) {
        try {
          // Dispatch action để refresh token
          const refreshResult = await store.dispatch(refreshToken());

          if (refreshToken.fulfilled.match(refreshResult)) {
            // Thử lại request với token mới
            const newToken = authService.getToken();

            fetchOptions.headers = {
              ...fetchOptions.headers,
              Authorization: `Bearer ${newToken}`,
            };

            const retryResponse = await fetch(
              `${API_URL}${endpoint}`,
              fetchOptions
            );

            if (!retryResponse.ok) {
              throw await retryResponse.json();
            }

            return await retryResponse.json();
          }
        } catch (error) {
          // Nếu refresh token thất bại, đăng xuất người dùng
          store.dispatch(logoutUser());
          throw new Error("Session expired. Please login again.");
        }
      }

      if (!response.ok) {
        throw await response.json();
      }

      // Nếu response là 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Các phương thức tiện ích
  get(endpoint: string, options: FetchOptions = {}): Promise<any> {
    return this.fetch(endpoint, { ...options, method: "GET" });
  },

  post(endpoint: string, data: any, options: FetchOptions = {}): Promise<any> {
    return this.fetch(endpoint, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any, options: FetchOptions = {}): Promise<any> {
    return this.fetch(endpoint, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string, options: FetchOptions = {}): Promise<any> {
    return this.fetch(endpoint, { ...options, method: "DELETE" });
  },
};

// Cách sử dụng:  apiClient.get('/posts')
// apiClient.post('/posts', { title: 'Hello', content: 'World' })
// apiClient.put('/posts/1', { title: 'Hello', content: 'World' })
// apiClient.delete('/posts/1')
// apiClient.fetch('/posts', { method: 'GET', requireAuth: true })
// apiClient.fetch('/posts', { method: 'POST', requireAuth: true, body: { title: 'Hello', content: 'World' } })
// apiClient.fetch('/posts/1', { method: 'PUT', requireAuth: true, body: { title: 'Hello', content: 'World' } })
// apiClient.fetch('/posts/1', { method: 'DELETE', requireAuth: true })
