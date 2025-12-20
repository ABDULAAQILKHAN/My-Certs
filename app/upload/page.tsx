"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCreateCertificateMutation, useGetCertificateValidityMutation } from "@/lib/api/certificatesApi"
import { uploadImage, deleteImage } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Upload, X, Loader2, Calendar, Building, FileText, Tag, Globe, Lock } from "lucide-react"

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    isPublic: true,
  })
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [imageBase64, setImageBase64] = useState<string>("")
  const [isCredentialValid, setIsCredentialValid] = useState<boolean>(true)
  const [error, setError] = useState("")
  const [credentialId, setCredentialId] = useState("")
  const [isImageUploading, setIsImageUploading] = useState(false)
  const router = useRouter()
  const [createCertificate, { isLoading }] = useCreateCertificateMutation()
  const [certificateValidity] = useGetCertificateValidityMutation()
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size must be less than 10MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
      setFile(file)
      setError("")

      const reader = new FileReader()
      reader.onload = (event) => {
        setImageBase64(event.target?.result as string)
      }
      reader.readAsDataURL(file) // This is the key function
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Please enter a certificate title")
      return
    }
    if (!formData.issuer.trim()) {
      setError("Please enter the issuer name")
      return
    }
    if (!formData.issueDate) {
      setError("Please enter the issue date")
      return
    }
    try {
      setIsImageUploading(true)
      const data:any = await certificateValidity(formData.credentialId)

      const isValid:boolean = data.data.data

      if (isValid) {
        setIsCredentialValid(true)
      } else {
        setIsCredentialValid(false)
        setError("Invalid Credential ID. Please check and try again.")
        return
      }
      if (file) {
        try {
          const imagePath = await uploadImage(file)
          const imageUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${imagePath}`

          if (!imagePath) {
            setError("Failed to upload image. Please try again.")
            return
          }
        const payload = {
          ...formData,
          //skills,
          image: imageUrl,
          imagePath,
        }
  
        const response = await createCertificate(payload).unwrap()
        if (response.statusCode !== 201) {
          setError(response.message || "Failed to upload certificate")
          if(imagePath){
            deleteImage(imagePath)
              .then((res) => {
                console.log("Image deleted", res)
                //router.push("/dashboard")
                })
              .catch((err) => console.error("Failed to delete image:", err))
          }
          return
        }
        router.push("/dashboard")

        } catch (uploadError) {
          setError("Failed to upload image. Please try again.")
          return
        } 
      } else{
        setError("Please select a certificate image to upload")
      }
    } catch (err: any) {
      setError(err.data?.message || "Failed to upload certificate")
    } finally {
          setIsImageUploading(false);
    }
  }
  useEffect(() => {
    const validateCredential = async () => {
      if (credentialId.trim()) {
        try {
          const isValid:boolean = await certificateValidity(credentialId).unwrap()
          if(isValid)
            setIsCredentialValid(isValid)
          if (!isValid) {
            //setError("Credential ID already present")
            setIsCredentialValid(false)
          } else {
            //setError("")
            setIsCredentialValid(true)
          }
        } catch (err) {
          console.error("Error validating credential ID:", err)
        }
      } else {
        setIsCredentialValid(true)
        //setError("")
      }
    }
    if(credentialId.length>4)
    setTimeout(() => {
      validateCredential()
    }, 500);
  }, [credentialId])

  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }, { label: "Upload Certificate" }]

  return (
<DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Certificate</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Add a new certificate to your collection</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Main responsive container */}
              <div className="grid grid-cols-1 md:grid-cols-5 md:gap-x-8 lg:gap-x-12">
                {/* --- LEFT COLUMN (Image Upload) --- */}
                <div className="md:col-span-3 col-span-2 mb-8 md:mb-0">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Certificate Image
                  </label>

                  {!imageBase64 ? (
                    <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors h-[90%] flex flex-col justify-center`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Click to upload
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imageBase64 || "/placeholder.svg"}
                        alt="Certificate preview"
                        className="w-full rounded-lg shadow-md aspect-[4/3] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageBase64("")
                          setFile(null)
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* --- RIGHT COLUMN (Form Fields) --- */}
                <div className="md:col-span-2 space-y-6">
                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div className="sm:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FileText className="inline h-4 w-4 mr-1" />
                        Certificate Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g., AWS Certified Solutions Architect"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Brief description of the certificate..."
                      />
                    </div>

                    <div>
                      <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Building className="inline h-4 w-4 mr-1" />
                        Issuer *
                      </label>
                      <input
                        type="text"
                        id="issuer"
                        value={formData.issuer}
                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g., Amazon Web Services"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Credential ID
                      </label>
                      <input
                        type="text"
                        id="credentialId"
                        value={formData.credentialId}
                        onChange={(e) => {
                          setFormData({ ...formData, credentialId: e.target.value })
                          setCredentialId(e.target.value)  
                        }}
                        className={`w-full px-3 py-2 border ${isCredentialValid ? "border-gray-300 dark:border-gray-600" : "border-2 border-red-600 dark:border-red-600"} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="Certificate ID or verification code"
                      />
                      {!isCredentialValid && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">Credential ID already present</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        id="issueDate"
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Privacy Settings
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="privacy"
                          checked={formData.isPublic}
                          onChange={() => setFormData({ ...formData, isPublic: true })}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Public</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Anyone with the link can view this certificate
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="privacy"
                          checked={!formData.isPublic}
                          onChange={() => setFormData({ ...formData, isPublic: false })}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Private</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Only you can view this certificate</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isImageUploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading || isImageUploading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </div>
                ) : (
                  "Upload Certificate"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
