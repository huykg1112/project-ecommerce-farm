import type { User, UserRole, UserStatistics } from "@/interfaces"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { mockRoles, mockUsers, mockUserStatistics } from "../mock-data"

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
            getUsers: builder.query<User[], void>({
                  // Comment lại API call thật
                  // query: () => "/user",
                  queryFn: () => ({ data: mockUsers }),
                  providesTags: ["User"],
            }),
            getUserById: builder.query<User, string>({
                  // Comment lại API call thật
                  // query: (id) => `/user/${id}`,
                  queryFn: (id) => {
                        const user = mockUsers.find((u) => u.id === id)
                        return user ? { data: user } : { error: { status: 404, data: "User not found" } }
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
            createUser: builder.mutation<User, Partial<User>>({
                  // Comment lại API call thật
                  // query: (user) => ({
                  //   url: "/user/register",
                  //   method: "POST",
                  //   body: user,
                  // }),
                  queryFn: (user) => {
                        const newUser: User = {
                              id: Date.now().toString(),
                              username: user.username || "",
                              email: user.email || "",
                              fullName: user.fullName || "",
                              phone: user.phone || "",
                              address: user.address || "",
                              avatar: user.avatar,
                              isActive: user.isActive ?? true,
                              isVerified: user.isVerified ?? false,
                              // role: mockRoles.find((r) => r.id === "3") || mockRoles[2], // Default to Client role
                              createdAt: user.createdAt,
                              updatedAt: user.updatedAt,
                        }
                        mockUsers.push(newUser)
                        return { data: newUser }
                  },
                  invalidatesTags: ["User", "UserStatistics"],
            }),
            updateUser: builder.mutation<User, Partial<User>>({
                  // Comment lại API call thật
                  // query: (user) => ({
                  //   url: `/user/${user.id}`,
                  //   method: "PUT",
                  //   body: user,
                  // }),
                  queryFn: (user) => {
                        const index = mockUsers.findIndex((u) => u.id === user.id)
                        if (index === -1) {
                              return { error: { status: 404, data: "User not found" } }
                        }
                        mockUsers[index] = { ...mockUsers[index], ...user, updatedAt: new Date().toISOString() }
                        return { data: mockUsers[index] }
                  },
                  invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User", "UserStatistics"],
            }),
            deleteUser: builder.mutation<void, string>({
                  // Comment lại API call thật
                  // query: (id) => ({
                  //   url: `/user/${id}`,
                  //   method: "DELETE",
                  // }),
                  queryFn: (id) => {
                        const index = mockUsers.findIndex((u) => u.id === id)
                        if (index === -1) {
                              return { error: { status: 404, data: "User not found" } }
                        }
                        mockUsers.splice(index, 1)
                        return { data: undefined }
                  },
                  invalidatesTags: ["User", "UserStatistics"],
            }),
            assignRole: builder.mutation<User, { userId: string; roleId: string }>({
                  // Comment lại API call thật
                  // query: (data) => ({
                  //   url: "/user/assign-role",
                  //   method: "PUT",
                  //   body: data,
                  // }),
                  queryFn: ({ userId, roleId }) => {
                        const userIndex = mockUsers.findIndex((u) => u.id === userId)
                        const role = mockRoles.find((r) => r.id === roleId)
                        if (userIndex === -1 || !role) {
                              return { error: { status: 404, data: "User or role not found" } }
                        }
                        mockUsers[userIndex].role = role
                        mockUsers[userIndex].updatedAt = new Date().toISOString()
                        return { data: mockUsers[userIndex] }
                  },
                  invalidatesTags: (result, error, { userId }) => [{ type: "User", id: userId }, "User", "UserStatistics"],
            }),
            verifyDistributor: builder.mutation<User, string>({
                  queryFn: (userId) => {
                        const userIndex = mockUsers.findIndex((u) => u.id === userId)
                        if (userIndex === -1) {
                              return { error: { status: 404, data: "User not found" } }
                        }
                        mockUsers[userIndex].isVerified = true
                        mockUsers[userIndex].updatedAt = new Date().toISOString()
                        return { data: mockUsers[userIndex] }
                  },
                  invalidatesTags: (result, error, userId) => [{ type: "User", id: userId }, "User", "UserStatistics"],
            }),
            unverifyDistributor: builder.mutation<User, string>({
                  queryFn: (userId) => {
                        const userIndex = mockUsers.findIndex((u) => u.id === userId)
                        if (userIndex === -1) {
                              return { error: { status: 404, data: "User not found" } }
                        }
                        mockUsers[userIndex].isVerified = false
                        mockUsers[userIndex].updatedAt = new Date().toISOString()
                        return { data: mockUsers[userIndex] }
                  },
                  invalidatesTags: (result, error, userId) => [{ type: "User", id: userId }, "User", "UserStatistics"],
            }),
            blockUser: builder.mutation<User, string>({
                  queryFn: (userId) => {
                        const userIndex = mockUsers.findIndex((u) => u.id === userId)
                        if (userIndex === -1) {
                              return { error: { status: 404, data: "User not found" } }
                        }
                        mockUsers[userIndex].isActive = false
                        mockUsers[userIndex].updatedAt = new Date().toISOString()
                        return { data: mockUsers[userIndex] }
                  },
                  invalidatesTags: (result, error, userId) => [{ type: "User", id: userId }, "User", "UserStatistics"],
            }),
            unblockUser: builder.mutation<User, string>({
                  queryFn: (userId) => {
                        const userIndex = mockUsers.findIndex((u) => u.id === userId)
                        if (userIndex === -1) {
                              return { error: { status: 404, data: "User not found" } }
                        }
                        mockUsers[userIndex].isActive = true
                        mockUsers[userIndex].updatedAt = new Date().toISOString()
                        return { data: mockUsers[userIndex] }
                  },
                  invalidatesTags: (result, error, userId) => [{ type: "User", id: userId }, "User", "UserStatistics"],
            }),
            getRoles: builder.query<UserRole[], void>({
                  // Comment lại API call thật
                  // query: () => "/roles",
                  queryFn: () => ({ data: mockRoles }),
            }),
      }),
})

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
} = userApi
