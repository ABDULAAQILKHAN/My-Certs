"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { initializeAuth } from "@/lib/slices/authSlice"

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return <>{children}</>
}
