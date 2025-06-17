"use client"

import type React from "react"
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setTheme } from "@/lib/slices/themeSlice"
import { initializeAuth } from "@/lib/slices/authSlice"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth())

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      dispatch(setTheme(savedTheme === "dark"))
    } else if (prefersDark) {
      dispatch(setTheme(true))
    }
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light")
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return <div className={isDark ? "dark" : ""}>{children}</div>
}
