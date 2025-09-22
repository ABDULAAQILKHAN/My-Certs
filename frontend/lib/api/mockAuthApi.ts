import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Mock localStorage functions
const getStoredUsers = (): Array<User & { password: string }> => {
  const users = localStorage.getItem("mycerts_users")
  return users ? JSON.parse(users) : []
}

const storeUser = (user: User & { password: string }) => {
  const users = getStoredUsers()
  const existingIndex = users.findIndex((u) => u.email === user.email)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem("mycerts_users", JSON.stringify(users))
}

const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const mockAuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: async ({ email, password }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const users = getStoredUsers()
        const user = users.find((u) => u.email === email && u.password === password)

        if (!user) {
          return { error: { status: 401, data: { message: "Invalid email or password" } } }
        }

        const { password: _, ...userWithoutPassword } = user
        const token = generateToken()

        // Store current session
        localStorage.setItem("mycerts_token", token)
        localStorage.setItem("mycerts_current_user", JSON.stringify(userWithoutPassword))

        return {
          data: {
            user: userWithoutPassword,
            token,
          },
        }
      },
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      queryFn: async ({ name, email, password }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const users = getStoredUsers()
        const existingUser = users.find((u) => u.email === email)

        if (existingUser) {
          return { error: { status: 400, data: { message: "User already exists with this email" } } }
        }

        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password,
          phone: "",
          avatar: "",
        }

        storeUser(newUser)

        const { password: _, ...userWithoutPassword } = newUser
        const token = generateToken()

        // Store current session
        localStorage.setItem("mycerts_token", token)
        localStorage.setItem("mycerts_current_user", JSON.stringify(userWithoutPassword))

        return {
          data: {
            user: userWithoutPassword,
            token,
          },
        }
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      queryFn: async ({ email }) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const users = getStoredUsers()
        const user = users.find((u) => u.email === email)

        if (!user) {
          return { error: { status: 404, data: { message: "No user found with this email" } } }
        }

        return {
          data: {
            message: "Password reset link has been sent to your email (simulated)",
          },
        }
      },
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      queryFn: async (userData) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const currentUser = localStorage.getItem("mycerts_current_user")
        if (!currentUser) {
          return { error: { status: 401, data: { message: "Not authenticated" } } }
        }

        const user = JSON.parse(currentUser)
        const users = getStoredUsers()
        const userIndex = users.findIndex((u) => u.id === user.id)

        if (userIndex === -1) {
          return { error: { status: 404, data: { message: "User not found" } } }
        }

        const updatedUser = { ...users[userIndex], ...userData }
        users[userIndex] = updatedUser
        localStorage.setItem("mycerts_users", JSON.stringify(users))

        const { password: _, ...userWithoutPassword } = updatedUser
        localStorage.setItem("mycerts_current_user", JSON.stringify(userWithoutPassword))

        return { data: userWithoutPassword }
      },
      invalidatesTags: ["User"],
    }),
  }),
})

export const { useLoginMutation, useSignupMutation, useForgotPasswordMutation, useUpdateProfileMutation } = mockAuthApi
