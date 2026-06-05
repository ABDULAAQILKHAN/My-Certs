"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import { useAppSelector } from "@/lib/hooks"
import { Eye, EyeOff, Award, Loader2, CircleCheckBig, Check, X, User, Mail, Phone, Lock } from "lucide-react"
import { signUp } from '@/lib/auth'

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false)

  // Live password validation state blocks
  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })

  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Track password changes to update live conditions indicator UI
  useEffect(() => {
    setPasswordConditions({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    })
  }, [password])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhoneNumber = (phone: string) => {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}$/
    return re.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) return setError("Name is required")
    if (!email.trim()) return setError("Email is required")
    if (!validateEmail(email)) return setError("Please enter a valid email address")
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) return setError("Please enter a valid phone number")
    if (!password) return setError("Password is required")

    // Ensure all live conditions pass upon submission evaluation
    const allConditionsMet = Object.values(passwordConditions).every(Boolean)
    if (!allConditionsMet) {
      return setError("Please meet all password strength security guidelines.")
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    setIsLoading(true)
    try {
      const { error } = await signUp(email, password, name, phoneNumber)

      if (error) {
        setError(error)
        return
      }
      setIsSuccessOpen(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
      setError('Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 relative py-12">

        {/* Success Modal Overlay */}
        {isSuccessOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700 transform scale-100 transition-transform">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CircleCheckBig size="50px" className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Signup Successful!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                  We've sent a validation link to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span>. Please check your email to verify your account.
                </p>
                <button
                  onClick={() => setIsSuccessOpen(false)}
                  className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-green-600/20"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Improved Aesthetic Fluid Background Pattern */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 -z-10 transition-colors duration-300">
          <div className="absolute inset-0 opacity-40 dark:opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 dark:bg-purple-500/10 rounded-full filter blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-400/20 dark:bg-fuchsia-500/10 rounded-full filter blur-[120px] animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Join Safe Pramaan to securely manage and share digital credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 shadow-slate-200/50 dark:shadow-none">
              {error && (
                <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 rounded-xl flex items-start space-x-2 animate-shake">
                  <span className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name Input */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                      placeholder="Aaqil khan"
                    />
                  </div>
                </div>

                {/* Email Address Input */}
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
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label htmlFor="mobile" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Phone number
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Password Input */}
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
                      type={showPassword ? "text" : "password"}
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

                  {/* Live Password Checklist Panel UI */}
                  {password.length > 0 && (
                    <div className="mt-2.5 p-3 bg-slate-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 text-xs space-y-1.5 animate-slideDown">
                      <p className="font-semibold text-gray-600 dark:text-gray-400 mb-1">Password Strength Requirements:</p>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <span className={`flex items-center gap-1.5 ${passwordConditions.length ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {passwordConditions.length ? <Check size={14} /> : <X size={14} />} Min 8 characters
                        </span>
                        <span className={`flex items-center gap-1.5 ${passwordConditions.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {passwordConditions.uppercase ? <Check size={14} /> : <X size={14} />} Uppercase letter
                        </span>
                        <span className={`flex items-center gap-1.5 ${passwordConditions.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {passwordConditions.lowercase ? <Check size={14} /> : <X size={14} />} Lowercase letter
                        </span>
                        <span className={`flex items-center gap-1.5 ${passwordConditions.number ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {passwordConditions.number ? <Check size={14} /> : <X size={14} />} One number
                        </span>
                        <span className={`flex items-center gap-1.5 ${passwordConditions.specialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {passwordConditions.specialChar ? <Check size={14} /> : <X size={14} />} Special character (!@#$)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm ${confirmPassword
                        ? password === confirmPassword
                          ? "border-green-300 dark:border-green-800 focus:ring-green-500/20 focus:border-green-500"
                          : "border-red-300 dark:border-red-800 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-200 dark:border-gray-700"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Live Comparison Matching Status UI */}
                  {confirmPassword.length > 0 && (
                    <div className="mt-1.5 flex items-center text-xs animate-fadeIn">
                      {password === confirmPassword ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                          <Check size={14} /> Passwords match perfectly
                        </span>
                      ) : (
                        <span className="text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
                          <X size={14} /> Passwords do not match yet
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 flex justify-center py-2.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl shadow-lg shadow-purple-600/10 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
              </button>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold transition-all">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}