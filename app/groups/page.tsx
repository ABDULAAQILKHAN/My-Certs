"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGetGroupsQuery } from "@/lib/api/groupsApi"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GroupCard } from "@/components/group-card"
import { CreateGroupModal } from "@/components/create-group-modal"
import { Search, Plus, Loader2, Layers } from "lucide-react"

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const router = useRouter()

  const {
    data: groups,
    isLoading,
    error,
    refetch
  } = useGetGroupsQuery({
    search: searchQuery,
  })

  const breadcrumbs = [{ label: "Groups" }]

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificate Groups</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Organize and share collections of certificates</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors backdrop-blur-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Failed to load groups</p>
        </div>
      ) : groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => router.push(`/groups/${group.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No groups found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Create groups to organize your certificates by topic, issuer, or skill set.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first group
            </button>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <CreateGroupModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={() => {
            // Refetch or handle success
            refetch()
          }}
        />
      )}
    </DashboardLayout>
  )
}
