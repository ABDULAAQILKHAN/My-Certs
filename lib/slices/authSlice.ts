import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isInitialized = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isInitialized = true
      // Clear localStorage
      localStorage.removeItem("mycerts_token")
      localStorage.removeItem("mycerts_current_user")
    },
    initializeAuth: (state) => {
      // Check for existing session
      const token = localStorage.getItem("mycerts_token")
      const userStr = localStorage.getItem("mycerts_current_user")

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.token = token
          state.isAuthenticated = true
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem("mycerts_token")
          localStorage.removeItem("mycerts_current_user")
        }
      }
      state.isInitialized = true
    },
  },
})

export const { setCredentials, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer
