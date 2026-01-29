"use client"

import type React from "react"
import { useState } from "react"
import { useGetCertificatesQuery } from "@/lib/api/certificatesApi"
import { useCreateGroupMutation } from "@/lib/api/groupsApi"
import { X, Loader2, Globe, Lock, Check } from "lucide-react"

interface CreateGroupModalProps {
  onClose: () => void
  onSuccess?: () => void
}

export function CreateGroupModal({ onClose, onSuccess }: CreateGroupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  })
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([])
  const [error, setError] = useState("")
  
  const { data: certificates, isLoading: isLoadingCertificates } = useGetCertificatesQuery({})
  const [createGroup, { isLoading: isSubmitting }] = useCreateGroupMutation()

  const handleToggleCertificate = (certId: string) => {
    setSelectedCertIds(prev => 
      prev.includes(certId) 
        ? prev.filter(id => id !== certId) 
        : [...prev, certId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Please enter a group name")
      return
    }

    if (selectedCertIds.length === 0) {
      setError("Please select at least one certificate")
      return
    }

    try {
      await createGroup({
        ...formData,
        certificateIds: selectedCertIds,
      }).unwrap()
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create group")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Certificate Group</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form id="create-group-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., Cloud Computing Certs"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Brief description of this collection..."
              />
            </div>

            {/* Certificate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Certificates *
              </label>
              
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                {isLoadingCertificates ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : certificates && certificates.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {certificates.map((cert) => (
                      <div 
                        key={cert.id} 
                        className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${selectedCertIds.includes(cert.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        onClick={() => handleToggleCertificate(cert.id)}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${selectedCertIds.includes(cert.id) ? 'bg-primary border-primary text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'}`}>
                          {selectedCertIds.includes(cert.id) && <Check className="h-3 w-3" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cert.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cert.issuer}</p>
                        </div>
                        
                        {cert.image && (
                          <img 
                            src={cert.image} 
                            alt={cert.title} 
                            className="h-10 w-14 object-cover rounded ml-3 bg-gray-200 dark:bg-gray-700" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No certificates found. Please upload some first.
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {selectedCertIds.length} certificate{selectedCertIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Privacy Settings
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
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
                      Anyone with the link can view this group
                    </p>
                  </div>
                </label>

                <label className="flex items-center cursor-pointer">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">Only you can view this group</p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end space-x-3 shrink-0 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-group-form"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </div>
            ) : (
              "Create Group"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
