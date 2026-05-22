"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation" // Added for routing
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { initializeAuth } from "@/lib/slices/authSlice"
import { useGetThemeQuery } from "@/lib/api/themeApi"
import { setTheme } from "@/lib/slices/themeSlice"
import { supabase } from "@/lib/supabaseClient" // Adjust path to your Supabase client

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

  // 2. NEW: Supabase hash listener to handle forgot-password and sign-up success redirects
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // A. Handle Forgot Password Flow
      if (event === "PASSWORD_RECOVERY") {
        // Redux might need to know they are technically authed to change password
        dispatch(initializeAuth()) 
        router.push("/update-password")
      }

      // B. Handle Email Confirmation / Signup Redirect Login
      if (event === "SIGNED_IN" && session) {
        // Force your Redux slice to grab the fresh session tokens from local storage
        dispatch(initializeAuth()) 
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch, router])

  // 3. Existing theme synchronization logic
  useEffect(() => {
    if (isSuccess && isDarkTheme !== undefined) {
      dispatch(setTheme(isDarkTheme))
    }
  }, [isSuccess, isDarkTheme, dispatch])

  return <>{children}</>
}