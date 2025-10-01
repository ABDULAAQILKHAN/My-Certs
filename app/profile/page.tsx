"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useUpdateProfileMutation } from "@/lib/api/authApi"
import { DashboardLayout } from "@/components/dashboard-layout"
import { User, Mail, Phone, Save, Loader2, Camera } from "lucide-react"
import { useGetUserProfileQuery } from "@/lib/api/authApi"
import { updateUserProfile, uploadImage } from "@/lib/auth"
export default function ProfilePage() {
  const { user, token } = useAppSelector((state) => state.auth)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [totalCertificates, setTotalCertificates] = useState(0)
  const [publicCertificates, setPublicCertificates] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)


  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const { data: profileData, isLoading: isUserLoading, error: userError} = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !token,
    refetchOnReconnect: true,
  })
  useEffect(() => {
    if (profileData && profileData?.statusCode === 200) {
      console.log("Profile Data:", profileData)
      const data = profileData.data;
      if(!data) return
      setFormData(prev => ({
        ...prev,
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        avatar: (data as any).avatar || prev.avatar || "",
      }))
      setTotalCertificates(data.totalCertificates || 0)
      setPublicCertificates(data.totalPublicCertificates || 0)
      setTotalViews(data.totalViews || 0)
    }
    if (userError) {
      console.error("Error fetching profile:", userError)
    }
  }, [profileData, token, userError])

function formatIndianNumber(input: string): string {
  // Remove all non-digit characters
  let digits = input.replace(/\D/g, '');

  // Remove leading 0 if present
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Ensure only 10 digits
  if (digits.length > 10) {
    digits = digits.slice(-10); // take last 10 digits
  } else if (digits.length < 10) {
    console.log('Invalid number: must have 10 digits');
  }

  // Return with +91 prefix
  return `+91 ${digits}`;
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    if(!formData.name || !formData.email || !formData.phone){
      setError("Please fill all the fields!")
      return
    }
    if(formData.phone.length < 10){
      setError("Please enter a valid phone number!")
      return
    }
    formData.phone = formatIndianNumber(formData.phone);
    try {
      const payload = {
          name: formData.name,
          phone: formData.phone,
          avatar: formData.avatar,
        }
        const {success, error} = await updateUserProfile(payload)
      if (error) {
        setError(error)
        return
      }
      if (!success) {
        setError("Failed to update profile")
        return
      }
  const response = await updateProfile(payload).unwrap()
      if (!response) {
        setError("Failed to update profile")
        return
      }
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (err: any) {
      setError(err.data?.message || "Failed to update profile")
    }
  }

  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Profile" }]
  if (isUserLoading) {
    return (
      <div className="h-screen text-center flex flex-col justify-center relative z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Profile...</p>
      </div>
    )
  }
  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          <div className="p-6">
            {message && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    {formData.avatar ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${formData.avatar}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('avatarInput')?.click() }
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  </button>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setIsUploadingAvatar(true)
                      setError("")
                      try {
                        const path = await uploadImage(file)
                        setFormData(prev => ({ ...prev, avatar: path }))
                        // Immediately persist avatar metadata (optional early save)
                        await updateUserProfile({ avatar: path })
                        setMessage("Profile picture updated")
                        setTimeout(() => setMessage(""), 3000)
                      } catch (err: any) {
                        console.error('Avatar upload failed', err)
                        setError(err?.message || 'Failed to upload avatar')
                      } finally {
                        setIsUploadingAvatar(false)
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload a new profile picture</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    disabled
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Account Statistics */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalCertificates}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Certificates</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{publicCertificates}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Public Certificates</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{totalViews}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
