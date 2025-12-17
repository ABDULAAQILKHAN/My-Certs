"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { toggleTheme } from "@/lib/slices/themeSlice"

export function SiteHeader() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const isDark = useAppSelector((state) => state.theme.isDark)
  const dispatch = useAppDispatch()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/quality.png" alt="My Certs" width={28} height={28} />
          <span className="text-lg font-semibold">My Certs</span>
        </Link>

        {/* Optional nav kept intentionally omitted as per user preference */}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => dispatch(toggleTheme())}
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </Button>
          {isAuthenticated ? (
            <Button asChild variant="ghost">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.76 4.84 5.34 3.42 3.92 4.84 5.34 6.26 6.76 4.84ZM1 13h3v-2H1v2Zm10 10h2v-3h-2v3Zm9-10v-2h-3v2h3Zm-3.76-8.16 1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.66 12.34 1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42ZM4.84 17.24 3.42 18.66l1.42 1.42 1.42-1.42-1.42-1.42Z" />
    </svg>
  )
}

export default SiteHeader
