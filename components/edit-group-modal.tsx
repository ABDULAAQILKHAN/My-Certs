"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGetCertificatesQuery } from "@/lib/api/certificatesApi"
import { useUpdateGroupMutation, Group } from "@/lib/api/groupsApi"
import { X, Loader2, Check, Globe, Lock } from "lucide-react"

interface EditGroupModalProps {
  group: Group
  onClose: () => void
  onSuccess?: () => void
}

export function EditGroupModal({ group, onClose, onSuccess }: EditGroupModalProps) {
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
    isPublic: group.isPublic,
  })
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    group.certificates?.map(c => c.id) || []
  )
  const [error, setError] = useState("")
  
  const { data: certificates, isLoading: isLoadingCertificates } = useGetCertificatesQuery({})
  const [updateGroup, { isLoading: isSubmitting }] = useUpdateGroupMutation()

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

    try {
      await updateGroup({
        id: group.id,
        data: {
          ...formData,
          certificateIds: selectedCertIds,
        }
      }).unwrap()
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update group")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Certificate Group</h3>
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

          <form id="edit-group-form" onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="What is this collection about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Visibility
              </label>
              <div className="flex space-x-4">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.isPublic ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: true })}
                    className="sr-only"
                  />
                  <Globe className={`h-5 w-5 mr-2 ${formData.isPublic ? 'text-primary' : 'text-gray-500'}`} />
                  <div>
                    <span className={`block text-sm font-medium ${formData.isPublic ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>Public</span>
                    <span className="block text-xs text-gray-500">Anyone with link can view</span>
                  </div>
                </label>

                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${!formData.isPublic ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}`}>
                  <input
                    type="radio"
                    name="isPublic"
                    checked={!formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                    className="sr-only"
                  />
                  <Lock className={`h-5 w-5 mr-2 ${!formData.isPublic ? 'text-primary' : 'text-gray-500'}`} />
                  <div>
                    <span className={`block text-sm font-medium ${!formData.isPublic ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>Private</span>
                    <span className="block text-xs text-gray-500">Only you can view</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Certificates
              </label>
              
              {isLoadingCertificates ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : certificates && certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-1">
                  {certificates.map((cert) => {
                    const isSelected = selectedCertIds.includes(cert.id)
                    return (
                      <div 
                        key={cert.id}
                        onClick={() => handleToggleCertificate(cert.id)}
                        className={`
                          relative flex items-center p-3 border rounded-lg cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <div className="h-10 w-12 rounded overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          {cert.image ? (
                            <img src={cert.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                            {cert.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{cert.issuer}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">No certificates found to add.</p>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {selectedCertIds.length} certificate{selectedCertIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-group-form"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
