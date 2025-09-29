"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { ThemeProvider } from "./theme-provider"
import { AuthInitializer } from "@/components/AuthInitializer"
// import PersistGateWrapper from '@/components/PersistGateWrapper'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <ThemeProvider>          
          {children}
        </ThemeProvider>
      </AuthInitializer>
      {/* <PersistGateWrapper>
        </PersistGateWrapper> */}
    </Provider>
  )
}
