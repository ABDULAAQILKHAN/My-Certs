"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation" // Added for routing
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { initializeAuth } from "@/lib/slices/authSlice"
import { useGetThemeQuery } from "@/lib/api/themeApi"
import { setTheme } from "@/lib/slices/themeSlice"


export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter() // Added for client-side navigation
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  const { data: isDarkTheme, isSuccess } = useGetThemeQuery(undefined, {
    skip: !isAuthenticated,
  })

  // 1. Existing initial state hydration
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // 2. Remove Supabase hash listener. Just depend on initializeAuth.

  // 3. Existing theme synchronization logic
  useEffect(() => {
    if (isSuccess && isDarkTheme !== undefined) {
      dispatch(setTheme(isDarkTheme))
    }
  }, [isSuccess, isDarkTheme, dispatch])

  return <>{children}</>
}