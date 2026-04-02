"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { DashboardLayout } from "@/components/dashboard-layout"
import { User, Mail, Phone, Save, Loader2, Camera, MapPin, Briefcase } from "lucide-react"
import { uploadImage } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    address: "",
    designation: ""
  })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      // Set default values from user auth data first
      const defaultData = {
        id: user.id,
        full_name: user.name || "",
        email: user.email || "",
        phone_number: user.phone || "",
        avatar_url: user.avatar || "",
        address: "",
        designation: ""
      }

      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          // Use default data from auth user for any error
          setFormData(defaultData)
        } else if (data) {
          setFormData({
            id: data.id,
            full_name: data.full_name || user.name || "",
            email: data.email || user.email || "",
            phone_number: data.phone_number || user.phone || "",
            avatar_url: data.avatar_url || user.avatar || "",
            address: data.address || "",
            designation: data.designation || ""
          })
        } else {
          // No data returned, use defaults
          setFormData(defaultData)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        // On any exception, still set defaults
        setFormData(defaultData)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    fetchProfile()
  }, [user])

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
    }

    // Return with +91 prefix
    return `+91 ${digits}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    
    const trimmedName = formData.full_name.trim()
    const trimmedEmail = formData.email.trim()
    
    if(!trimmedName || !trimmedEmail){
      setError("Name and Email are required!")
      return
    }

    setIsSaving(true)
    try {
      const updates = {
        id: user?.id,
        full_name: trimmedName,
        email: trimmedEmail,
        phone_number: formData.phone_number.trim(),
        avatar_url: formData.avatar_url,
        address: formData.address.trim(),
        designation: formData.designation.trim(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates)

      if (error) {
        throw error
      }

      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (err: any) {
      console.error("Update failed:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    setError("")
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true })
        
      if (error) throw error
      
      const publicUrl = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl
      
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      
      // Auto-save the avatar URL to profile
      if (user?.id) {
        await supabase.from('profiles').upsert({ 
          id: user.id, 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
      }
      
      setMessage("Profile picture updated")
      setTimeout(() => setMessage(""), 3000)
    } catch (err: any) {
      console.error('Avatar upload failed', err)
      setError(err?.message || 'Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Profile" }]

  if (isLoading || !isInitialized) {
    return (
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="h-[60vh] text-center flex flex-col justify-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Profile...</p>
        </div>
      </DashboardLayout>
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
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {formData.avatar_url ? (
                      <img
                        src={formData.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
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
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload a new profile picture</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      placeholder="your.email@example.com"
                      disabled // Email normally shouldn't be changed easily
                    />
                  </div>
                </div>
                
                 <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="pl-10"
                      placeholder="e.g. Senior Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="pl-10"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="pl-10"
                      placeholder="Your address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
