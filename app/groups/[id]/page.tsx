"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetGroupByIdQuery, useDeleteGroupMutation, useRemoveCertificateFromGroupMutation, useUpdateGroupMutation } from "@/lib/api/groupsApi"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CertificateCard } from "@/components/certificate-card"
import { AddCertificatesModal } from "@/components/add-certificates-modal"
import { EditGroupModal } from "@/components/edit-group-modal"
import { ShareModal } from "@/components/share-modal"
import { Loader2, ArrowLeft, Layers, Calendar, Share2, Trash2, Plus, Edit, Globe, Lock, Check } from "lucide-react"
import { useState } from "react"
import type { Certificate } from "@/lib/api/certificatesApi"

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  // State
  const [sharedCertificate, setSharedCertificate] = useState<Certificate | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // API Hooks
  const { data: group, isLoading, error } = useGetGroupByIdQuery(id)
  const [deleteGroup] = useDeleteGroupMutation()
  const [updateGroup, { isLoading: isTogglingVisibility }] = useUpdateGroupMutation()
  const [removeCertificate] = useRemoveCertificateFromGroupMutation()

  const handleDeleteGroup = async () => {
    if (confirm("Are you sure you want to delete this group?")) {
      setIsDeleting(true)
      try {
        await deleteGroup(id).unwrap()
        router.push("/groups")
      } catch (err) {
        console.error("Failed to delete group:", err)
        setIsDeleting(false)
      }
    }
  }

  const handleTogglePublic = async () => {
    if (!group) return
    try {
      await updateGroup({
        id: group.id,
        data: {
          isPublic: !group.isPublic
        }
      }).unwrap()
    } catch (err) {
      console.error("Failed to update visibility:", err)
      alert("Failed to update group visibility. Please try again.")
    }
  }

  const handleRemoveCertificate = async (certificateId: string) => {
    if (confirm("Remove this certificate from the group?")) {
      try {
        await removeCertificate({ groupId: id, certificateId }).unwrap()
      } catch (err) {
        console.error("Failed to remove certificate:", err)
      }
    }
  }

  const breadcrumbs = [
    { label: "Groups", href: "/groups" },
    { label: group?.name || "Group Details" },
  ]

  if (isLoading) {
    return (
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !group) {
    return (
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Failed to load group details</p>
          <button
            onClick={() => router.push("/groups")}
            className="mt-4 px-4 py-2 text-sm text-primary hover:underline"
          >
            Back to Groups
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              {group.name}
              {!group.isPublic && (
                <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  Private
                </span>
              )}
            </h1>
            {group.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">{group.description}</p>
            )}
            
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                Created {new Date(group.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Layers className="h-4 w-4 mr-1.5" />
                {group.certificates?.length || 0} Certificates
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Visibility Toggle */}
            <button
              onClick={handleTogglePublic}
              disabled={isTogglingVisibility}
              className={`
                inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${group.isPublic
                  ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                }
              `}
              title={group.isPublic ? "Make Private" : "Make Public"}
            >
              {isTogglingVisibility
                ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                : group.isPublic
                  ? <Globe className="h-4 w-4 mr-2" />
                  : <Lock className="h-4 w-4 mr-2" />
              }
              {group.isPublic ? "Public" : "Private"}
            </button>

            {/* Share Button (Only if Public) */}
             <button
                onClick={() => setIsShareModalOpen(true)}
                disabled={!group.isPublic}
                className={`
                  inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium transition-colors
                  ${!group.isPublic 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                  }
                `}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ml-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Certificates in this Group</h2>
        {/* Quick Add Button */}
        {/* <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Certificates
        </button> */}
      </div>

      {group.certificates && group.certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {group.certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id} 
              certificate={certificate}
              onClick={() => router.push(`/preview/${certificate.credentialId}`)}
              setSharedCertificate={setSharedCertificate}
              onRemove={() => handleRemoveCertificate(certificate.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No certificates yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Add certificates to this group to categorize them.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certificates
          </button>
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddCertificatesModal
          groupId={id}
          existingCertificateIds={group.certificates?.map(c => c.id) || []}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <EditGroupModal
          group={group}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isShareModalOpen && (
        <ShareModal
          group={group}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </DashboardLayout>
  )
}
