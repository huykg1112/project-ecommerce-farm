import type { Role, UserProfile, UserStatistics } from "@/interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockRoles, mockUsers, mockUserStatistics } from "../mock-data";

// Comment lại API thật và sử dụng mock data
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    // Comment lại phần prepare headers
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem("token")
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`)
    //   }
    //   return headers
    // },
  }),
  tagTypes: ["User", "UserStatistics"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserProfile[], void>({
      // Comment lại API call thật
      // query: () => "/user",
      queryFn: () => ({ data: mockUsers }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<UserProfile, string>({
      // Comment lại API call thật
      // query: (id) => `/user/${id}`,
      queryFn: (id) => {
        const user = mockUsers.find((u) => u.user_id === id);
        return user
          ? { data: user }
          : { error: { status: 404, data: "User not found" } };
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getUserStatistics: builder.query<UserStatistics, any>({
      // Comment lại API call thật
      // query: (params) => ({
      //   url: "/user/statistics",
      //   params,
      // }),
      queryFn: () => ({ data: mockUserStatistics }),
      providesTags: ["UserStatistics"],
    }),
    createUser: builder.mutation<UserProfile, Partial<UserProfile>>({
      // Comment lại API call thật
      // query: (user) => ({
      //   url: "/user/register",
      //   method: "POST",
      //   body: user,
      // }),
      queryFn: (user: Partial<UserProfile>) => {
        const newUser: UserProfile = {
          user_id: Date.now().toString(),
          username: user.username || "",
          email: user.email || "",
          full_name: user.full_name || "",
          phone_number: user.phone_number || "",
          address: user.address || "",
          avatar: user.avatar,
          is_active: user.is_active ?? true,
          is_verified: user.is_verified ?? false,
          // role: mockRoles.find((r) => r.id === "3") || mockRoles[2], // Default to Client role
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
          role_name: user.role_name || "",
        };
        mockUsers.push(newUser);
        return { data: newUser };
      },
      invalidatesTags: ["User", "UserStatistics"],
    }),
    updateUser: builder.mutation<UserProfile, Partial<UserProfile>>({
      // Comment lại API call thật
      // query: (user) => ({
      //   url: `/user/${user.id}`,
      //   method: "PUT",
      //   body: user,
      // }),
      queryFn: (user: Partial<UserProfile>) => {
        const index = mockUsers.findIndex((u) => u.user_id === user.user_id);
        if (index === -1) {
          return { error: { status: 404, data: "User not found" } };
        }
        mockUsers[index] = {
          ...mockUsers[index],
          ...user,
          updated_at: new Date().toISOString(),
        };
        return { data: mockUsers[index] };
      },
      invalidatesTags: (result, error, { user_id }) => [
        { type: "User", user_id },
        "User",
        "UserStatistics",
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      // Comment lại API call thật
      // query: (id) => ({
      //   url: `/user/${id}`,
      //   method: "DELETE",
      // }),
      queryFn: (id) => {
        const index = mockUsers.findIndex((u) => u.user_id === id);
        if (index === -1) {
          return { error: { status: 404, data: "User not found" } };
        }
        mockUsers.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: ["User", "UserStatistics"],
    }),
    assignRole: builder.mutation<
      UserProfile,
      { user_id: string; role_name: string }
    >({
      // Comment lại API call thật
      // query: (data) => ({
      //   url: "/user/assign-role",
      //   method: "PUT",
      //   body: data,
      // }),
      queryFn: ({ user_id, role_name }) => {
        const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
        const role = mockRoles.find((r) => r.role_name === role_name);
        if (userIndex === -1 || !role) {
          return { error: { status: 404, data: "User or role not found" } };
        }
        mockUsers[userIndex].role_name = role.role_name;
        mockUsers[userIndex].updated_at = new Date().toISOString();
        return { data: mockUsers[userIndex] };
      },
      invalidatesTags: (result, error, { user_id }) => [
        { type: "User", id: user_id },
        "User",
        "UserStatistics",
      ],
    }),
    verifyDistributor: builder.mutation<UserProfile, string>({
      queryFn: (user_id) => {
        const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
        if (userIndex === -1) {
          return { error: { status: 404, data: "User not found" } };
        }
        mockUsers[userIndex].is_verified = true;
        mockUsers[userIndex].updated_at = new Date().toISOString();
        return { data: mockUsers[userIndex] };
      },
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        "User",
        "UserStatistics",
      ],
    }),
    unverifyDistributor: builder.mutation<UserProfile, string>({
      queryFn: (user_id) => {
        const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
        if (userIndex === -1) {
          return { error: { status: 404, data: "User not found" } };
        }
        mockUsers[userIndex].is_verified = false;
        mockUsers[userIndex].updated_at = new Date().toISOString();
        return { data: mockUsers[userIndex] };
      },
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        "User",
        "UserStatistics",
      ],
    }),
    blockUser: builder.mutation<UserProfile, string>({
      queryFn: (user_id) => {
        const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
        if (userIndex === -1) {
          return { error: { status: 404, data: "User not found" } };
        }
        mockUsers[userIndex].is_active = false;
        mockUsers[userIndex].updated_at = new Date().toISOString();
        return { data: mockUsers[userIndex] };
      },
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        "User",
        "UserStatistics",
      ],
    }),
    unblockUser: builder.mutation<UserProfile, string>({
      queryFn: (user_id) => {
        const userIndex = mockUsers.findIndex((u) => u.user_id === user_id);
        if (userIndex === -1) {
          return { error: { status: 404, data: "User not found" } };
        }
        mockUsers[userIndex].is_active = true;
        mockUsers[userIndex].updated_at = new Date().toISOString();
        return { data: mockUsers[userIndex] };
      },
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        "User",
        "UserStatistics",
      ],
    }),
    getRoles: builder.query<Role[], void>({
      // Comment lại API call thật
      // query: () => "/roles",
      queryFn: () => ({ data: mockRoles }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserStatisticsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignRoleMutation,
  useVerifyDistributorMutation,
  useUnverifyDistributorMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetRolesQuery,
} = userApi;
