"use client"

import type React from "react"

import type { Certificate } from "@/lib/api/certificatesApi"
import { Calendar, Building, Eye, Share2 } from "lucide-react"

interface CertificateCardProps {
  certificate: Certificate
  onClick: () => void
}

export function CertificateCard({ certificate, onClick }: CertificateCardProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/public/${certificate.shareToken}`
    navigator.clipboard.writeText(shareUrl)
    // You could add a toast notification here
  }

  return (
    <div
      onClick={onClick}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        <img
          src={certificate.imageUrl || "/placeholder.svg?height=200&width=300"}
          alt={certificate.title}
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
            {certificate.isPublic && (
              <button
                onClick={handleShare}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{certificate.title}</h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{certificate.issuer}</span>
          </div>

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{new Date(certificate.issueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {certificate.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {certificate.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {skill}
              </span>
            ))}
            {certificate.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{certificate.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
