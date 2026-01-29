"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { initializeAuth } from "@/lib/slices/authSlice"
import { useGetThemeQuery } from "@/lib/api/themeApi"
import { setTheme } from "@/lib/slices/themeSlice"

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  const { data: isDarkTheme, isSuccess } = useGetThemeQuery(undefined, {
    skip: !isAuthenticated,
  })

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    if (isSuccess && isDarkTheme !== undefined) {
      dispatch(setTheme(isDarkTheme))
    }
  }, [isSuccess, isDarkTheme, dispatch])

  return <>{children}</>
}
