"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { forgotPassword } from "@/lib/auth"
import { Award, Loader2, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)
    try {
      const {success, error} = await forgotPassword(email)
      if (error) {
        setError(error)
        return
      }
      if (!success) {
        setError("Failed to send reset email")
        return
      }
      setMessage("Password reset email sent! Please check your inbox.")
    } catch (err: any) {
      setError(err.data?.message || "Failed to send reset email")
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 shadow-slate-200/50 dark:shadow-none">
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 rounded-xl flex items-start space-x-2 animate-shake">
                <span className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-5 p-3.5 bg-green-50 dark:bg-green-950/30 border border-green-200/60 dark:border-green-900/50 rounded-xl flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">{message}</span>
              </div>
            )}

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
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex justify-center py-2.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl shadow-lg shadow-purple-600/10 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
            </button>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
