"use client"

import type React from "react"
import type { Group } from "@/lib/api/groupsApi"
import { Calendar, Layers, Eye, Share2 } from "lucide-react"

interface GroupCardProps {
  group: Group
  onClick: () => void
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/groups/${group.id}`
    navigator.clipboard.writeText(shareUrl)
    // You might want to show a toast notification here
  }

  // Use the first certificate's image as the group cover, or placeholder
  const coverImage = group.certificates?.[0]?.image || "/placeholder.svg?height=200&width=300"

  return (
    <div
      onClick={onClick}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        <img
          src={coverImage}
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            {group.isPublic && (
              <button
                onClick={handleShare}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
        
        {/* Badge for number of certificates */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Layers className="w-3 h-3 mr-1" />
          {group._count?.certificates || group.certificates?.length || 0} items
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{group.name}</h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p className="line-clamp-2 text-xs">{group.description}</p>
          
          <div className="flex items-center pt-2">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
