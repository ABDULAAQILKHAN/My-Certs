"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"
import { Eye, EyeOff, Award, Loader2, Mail, Lock } from "lucide-react"
import { signIn } from "@/lib/auth"
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    console.log("isAuthenticated login", isAuthenticated)
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill all the fields!")
      return
    }
    setIsLoading(true)
    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error)
        return
      }
      const user = data.user.user_metadata;
      const token = data.session.access_token;

      dispatch(setCredentials({ user, token }))
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setEmail("demo@example.com")
    setPassword("demo123")
  }


  return (
    <>
      <SiteHeader />
      <div className="h-full py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        {/* Improved Aesthetic Fluid Background Pattern */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 -z-10 transition-colors duration-300">
          <div className="absolute inset-0 opacity-40 dark:opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 dark:bg-purple-500/10 rounded-full filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-400/20 dark:bg-fuchsia-500/10 rounded-full filter blur-[120px] animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your Safe Pramaan account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 shadow-slate-200/50 dark:shadow-none">
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 rounded-xl flex items-start space-x-2 animate-shake">
                  <span className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Demo credentials info
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                Email: demo@example.com | Password: demo123
              </p>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
              >
                Click to fill demo credentials
              </button>
            </div> */}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Email address
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <a href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 flex justify-center py-2.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl shadow-lg shadow-purple-600/10 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <a href={`${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}/signup?from=safe-pramaan`} className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
